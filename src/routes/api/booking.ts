import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
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
  travellers: z.coerce
    .number()
    .int()
    .positive("Travellers must be at least 1"),
  message: z.string().optional().default(""),
});

function getSupabaseClient(request: Request) {
  const supabaseUrl = process.env["SUPABASE_URL"];
  const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase server environment variables are missing.");
  }

  const authorization = request.headers.get("Authorization");

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: authorization
        ? {
            Authorization: authorization,
          }
        : {},
    },
  });
}

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

          const supabase = getSupabaseClient(request);

          /*
           * Find the requested trip.
           *
           * The frontend may send either:
           * - the trip UUID
           * - the trip slug
           */
          const { data: trip, error: tripError } = await supabase
            .from("trips")
            .select("id, title, slug, price, capacity, status")
            .or(`id.eq.${booking.trip},slug.eq.${booking.trip}`)
            .eq("status", "published")
            .maybeSingle();

          if (tripError) {
            console.error("Trip lookup error:", tripError);

            return Response.json(
              {
                success: false,
                message: "Could not verify the selected trip.",
              },
              { status: 500 },
            );
          }

          if (!trip) {
            return Response.json(
              {
                success: false,
                message: "The selected trip was not found.",
              },
              { status: 404 },
            );
          }

          /*
           * Calculate the total amount from the trip price.
           */
          const totalAmount =
            trip.price !== null
              ? Number(trip.price) * booking.travellers
              : null;

          /*
           * Check capacity if the trip has a capacity limit.
           */
          if (trip.capacity !== null) {
            const { data: existingBookings, error: capacityError } =
              await supabase
                .from("bookings")
                .select("number_of_people")
                .eq("trip_id", trip.id)
                .in("status", ["pending", "confirmed"]);

            if (capacityError) {
              console.error("Capacity check error:", capacityError);

              return Response.json(
                {
                  success: false,
                  message: "Could not verify trip availability.",
                },
                { status: 500 },
              );
            }

            const bookedPeople =
              existingBookings?.reduce(
                (total, item) => total + item.number_of_people,
                0,
              ) ?? 0;

            const remainingCapacity = trip.capacity - bookedPeople;

            if (booking.travellers > remainingCapacity) {
              return Response.json(
                {
                  success: false,
                  message: `Only ${Math.max(remainingCapacity, 0)} traveller(s) are currently available for this trip.`,
                },
                { status: 409 },
              );
            }
          }

          /*
           * Save the booking in Supabase.
           */
          const { data: savedBooking, error: bookingError } = await supabase
            .from("bookings")
            .insert({
              id: booking.bookingId,
              trip_id: trip.id,
              full_name: booking.name,
              email: booking.email,
              phone: booking.phone,
              number_of_people: booking.travellers,
              booking_date: booking.travelDate,
              special_requests: booking.message,
              status: "pending",
              total_amount: totalAmount,
              payment_status: "pending",
            })
            .select()
            .single();

          if (bookingError) {
            console.error("Supabase booking error:", bookingError);

            /*
             * If the same booking ID already exists,
             * treat it as a duplicate request.
             */
            if (bookingError.code === "23505") {
              return Response.json({
                success: true,
                duplicate: true,
                message: "This booking request has already been received.",
                bookingId: booking.bookingId,
              });
            }

            return Response.json(
              {
                success: false,
                message: "We could not save your booking right now.",
              },
              { status: 500 },
            );
          }

          console.log("Booking saved to Supabase:", savedBooking.id);

          /*
           * Keep the existing Google Sheets integration.
           */
          try {
            await appendBookingToSheet({
              ...booking,
              trip: trip.title,
            });
          } catch (error) {
            console.error(
              `Google Sheets booking sync failed for ${booking.bookingId}`,
              error,
            );
          }

          /*
           * Keep the existing email notification.
           */
          try {
            await sendBookingNotificationEmail({
              ...booking,
              trip: trip.title,
            });
          } catch (error) {
            console.error(
              `Booking notification failed for ${booking.bookingId}`,
              error,
            );

            return Response.json({
              success: true,
              notificationSent: false,
              message:
                "Booking saved successfully. We will follow up with you shortly.",
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
            {
              status:
                error instanceof ConfigurationError ? 503 : 500,
            },
          );
        }
      },
    },
  },
});