import { Resend } from "resend";

const resendApiKey = "re_2xxV35CV_9sMuZrwdd5cfxjnmo8hPwK9k";
const notificationEmail = "Chatpateroutes@gmail.com";

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY");
}

if (!notificationEmail) {
  throw new Error("Missing BOOKING_NOTIFICATION_EMAIL");
}

const resend = new Resend(resendApiKey);

export interface BookingEmailData {
  name: string;
  email: string;
  phone: string;
  trip: string;
  travelDate: string;
  travellers: number;
  message?: string;
}

export async function sendBookingNotificationEmail(
  booking: BookingEmailData,
): Promise<void> {
  const { error } = await resend.emails.send({
    from: "Chatpate Routes <onboarding@resend.dev>",
    to: [notificationEmail],
    subject: `New Booking - ${booking.trip}`,
    html: `
      <h2>New Booking Received</h2>

      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Trip:</strong> ${booking.trip}</p>
      <p><strong>Travel Date:</strong> ${booking.travelDate}</p>
      <p><strong>Travellers:</strong> ${booking.travellers}</p>
      <p><strong>Message:</strong> ${booking.message ?? "No message"}</p>
    `,
  });

 if (error) {
  console.error("RESEND FULL ERROR:", JSON.stringify(error, null, 2));
  throw new Error(error.message);
 }
}