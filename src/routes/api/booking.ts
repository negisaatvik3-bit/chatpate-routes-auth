import { createFileRoute } from "@tanstack/react-router";
import { appendBookingToSheet } from "../../lib/booking/google-sheets";
import { sendBookingNotificationEmail } from "../../lib/booking/email";
import { ConfigurationError } from "../../lib/server-env";
import { z } from "zod";
const bookingSchema = z.object({
  bookingId: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  trip: z.string().min(1, "Trip is required"),
  travelDate: z.string().min(1, "Travel date is required"),
  travellers: z.coerce.number().int().positive("Travellers must be at least 1"),
  message: z.string().optional().default(""),
});

export const Route = createFileRoute("/api/booking")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const result = bookingSchema.safeParse(body);

          if (!result.success) {
            return Response.json(
              {
                success: false,
                message: "Invalid booking details",
                errors: result.error.flatten().fieldErrors,
              },
              { status: 400 },
            );
          }

          const booking = {
            ...result.data,
            bookingId: result.data.bookingId ?? crypto.randomUUID(),
          };

          console.log("Valid booking received:", booking.bookingId);

          const created = await appendBookingToSheet(booking);
          if (!created) {
            return Response.json({
              success: true,
              duplicate: true,
              message: "This booking request has already been received.",
              bookingId: booking.bookingId,
            });
          }

          try {
            await sendBookingNotificationEmail(booking);
          } catch (error) {
            console.error(`Booking notification failed for ${booking.bookingId}`, error);
            return Response.json({
              success: true,
              notificationSent: false,
              message: "Booking saved. We will follow up with you shortly.",
              bookingId: booking.bookingId,
            });
          }

          return Response.json({
            success: true,
            notificationSent: true,
            message: "Booking received successfully.",
            bookingId: booking.bookingId,
          });
        } catch (error) {
          console.error("Booking API error:", error);

          return Response.json(
            {
              success: false,
              message:
                error instanceof ConfigurationError
                  ? "Booking service is not configured."
                  : "We could not save your booking right now.",
            },
            { status: error instanceof ConfigurationError ? 503 : 500 },
          );
        }
      },
    },
  },
});
