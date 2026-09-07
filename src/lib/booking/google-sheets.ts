import { getServerEnv, ConfigurationError, requireServerEnv } from "../server-env";

const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";
const MAX_RETRIES = 3;

export interface BookingData {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  trip: string;
  travelDate: string;
  travellers: number;
  message?: string;
}

interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
}

interface ValuesResponse {
  values?: Array<Array<string | number>>;
}

function encodeBase64Url(value: string | ArrayBuffer): string {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : new Uint8Array(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodePem(pem: string): ArrayBuffer {
  const base64 = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, "");
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0)).buffer;
}

function getCredentials(): ServiceAccountCredentials {
  const json = getServerEnv("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (json) {
    try {
      const credentials = JSON.parse(json) as Partial<ServiceAccountCredentials>;
      if (credentials.client_email && credentials.private_key) {
        return credentials as ServiceAccountCredentials;
      }
    } catch {
      throw new ConfigurationError("GOOGLE_SERVICE_ACCOUNT_JSON");
    }
  }

  const clientEmail = getServerEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = getServerEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  if (!clientEmail || !privateKey) {
    throw new ConfigurationError("GOOGLE_SERVICE_ACCOUNT_JSON");
  }

  return { client_email: clientEmail, private_key: privateKey };
}

async function createAccessToken(): Promise<string> {
  const credentials = getCredentials();
  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = encodeBase64Url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: GOOGLE_SHEETS_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const key = await crypto.subtle.importKey(
    "pkcs8",
    decodePem(credentials.private_key.replace(/\\n/g, "\n")),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(`${header}.${payload}`),
  );
  const assertion = `${header}.${payload}.${encodeBase64Url(signature)}`;
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google token request failed with status ${response.status}`);
  }

  const result = (await response.json()) as { access_token?: string };
  if (!result.access_token)
    throw new Error("Google token response did not include an access token");
  return result.access_token;
}

async function sheetsRequest<T>(
  accessToken: string,
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${accessToken}`,
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Google Sheets request failed with status ${response.status}: ${body}`);
  }
  return body ? (JSON.parse(body) as T) : ({} as T);
}

function getSheetName(): string {
  return getServerEnv("GOOGLE_SHEETS_SHEET") ?? "Sheet1";
}

function rangeUrl(spreadsheetId: string, range: string): string {
  return `${GOOGLE_SHEETS_API}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`;
}

async function bookingAlreadyExists(
  accessToken: string,
  spreadsheetId: string,
  bookingId: string,
): Promise<boolean> {
  const range = `${getSheetName()}!J:J`;
  const result = await sheetsRequest<ValuesResponse>(
    accessToken,
    `${rangeUrl(spreadsheetId, range)}?majorDimension=COLUMNS`,
  );
  return (result.values?.[0] ?? []).some((value) => String(value) === bookingId);
}

export async function appendBookingToSheet(booking: BookingData): Promise<boolean> {
  const spreadsheetId = requireServerEnv("GOOGLE_SPREADSHEET_ID");
  const sheetRange = `${getSheetName()}!A:J`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const accessToken = await createAccessToken();
      if (await bookingAlreadyExists(accessToken, spreadsheetId, booking.bookingId)) return false;

      await sheetsRequest(
        accessToken,
        `${rangeUrl(spreadsheetId, sheetRange)}?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        {
          method: "POST",
          body: JSON.stringify({
            values: [
              [
                new Date().toISOString(),
                booking.name,
                booking.email,
                booking.phone,
                booking.trip,
                booking.travelDate,
                booking.travellers,
                booking.message ?? "",
                "New",
                booking.bookingId,
              ],
            ],
          }),
        },
      );

      return true;
    } catch (error) {
      console.error(
        `Google Sheets attempt ${attempt} failed for booking ${booking.bookingId}`,
        error,
      );
      if (attempt === MAX_RETRIES) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }

  throw new Error("Booking could not be saved");
}
