import { getServerEnv, requireServerEnv } from "../server-env";

const RESEND_API_URL = "https://api.resend.com/emails";

export interface BookingEmailData {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  trip: string;
  travelDate: string;
  travellers: number;
  message?: string;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

export async function sendBookingNotificationEmail(booking: BookingEmailData): Promise<void> {
  const apiKey = requireServerEnv("RESEND_API_KEY");
  const notificationEmail = requireServerEnv("BOOKING_NOTIFICATION_EMAIL");
  const from = getServerEnv("RESEND_FROM_EMAIL") ?? "Chatpate Routes <onboarding@resend.dev>";
  const safe = {
    bookingId: escapeHtml(booking.bookingId),
    name: escapeHtml(booking.name),
    email: escapeHtml(booking.email),
    phone: escapeHtml(booking.phone),
    trip: escapeHtml(booking.trip),
    travelDate: escapeHtml(booking.travelDate),
    travellers: String(booking.travellers),
    message: escapeHtml(booking.message ?? "No message").replace(/\n/g, "<br />"),
  };
  const subjectTrip = booking.trip.replace(/[\r\n]+/g, " ").trim();
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [notificationEmail],
      subject: `New Booking - ${subjectTrip}`,
      html: `
        <h2>New Booking Received</h2>
        <p><strong>Booking ID:</strong> ${safe.bookingId}</p>
        <p><strong>Name:</strong> ${safe.name}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Phone:</strong> ${safe.phone}</p>
        <p><strong>Trip:</strong> ${safe.trip}</p>
        <p><strong>Travel Date:</strong> ${safe.travelDate}</p>
        <p><strong>Travellers:</strong> ${safe.travellers}</p>
        <p><strong>Message:</strong> ${safe.message}</p>
      `,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend request failed with status ${response.status}: ${details}`);
  }
}
