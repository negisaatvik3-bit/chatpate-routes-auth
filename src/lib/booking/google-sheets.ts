import { google } from "googleapis";
import path from "node:path";

const spreadsheetId = "1nlxb603L4NoCSjA9jwNRL4N-4BvhNgs-MKWH3EdgV4Q";

if (!spreadsheetId) {
  throw new Error("Missing GOOGLE_SPREADSHEET_ID");
}

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(
    process.cwd(),
    "google-service-account.json",
  ),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  trip: string;
  travelDate: string;
  travellers: number;
  message?: string;
}

export async function appendBookingToSheet(
  booking: BookingData,
): Promise<void> {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: "Sheet1!A:I",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
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
            ],
          ],
        },
      });

      console.log("Booking successfully added to Google Sheets");
      return;
    } catch (error) {
      console.error(
        `Google Sheets attempt ${attempt} failed:`,
        error,
      );

      if (attempt === maxRetries) {
        throw error;
      }

      const delay = attempt * 2000;

      console.log(`Retrying Google Sheets in ${delay}ms...`);

      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
    }
  }
}