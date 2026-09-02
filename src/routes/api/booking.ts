import { createFileRoute } from "@tanstack/react-router";
import { appendBookingToSheet } from "../../lib/booking/google-sheets";
import { sendBookingNotificationEmail } from "../../lib/booking/email";
import { z } from "zod";
const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  trip: z.string().min(1, "Trip is required"),
  travelDate: z.string().min(1, "Travel date is required"),
  travellers: z.number().int().positive("Travellers must be at least 1"),
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

          const booking = result.data;

          console.log("Valid booking received:", booking);

          await appendBookingToSheet(booking);
            await sendBookingNotificationEmail(booking);
          return Response.json({
            success: true,
            message: "Booking received successfully",
            data: booking,
          });
        } catch (error) {
          console.error("Booking API error:", error);

          return Response.json(
            {
              success: false,
              message: "Invalid request",
            },
            { status: 400 },
          );
        }
      },
    },
  },
});