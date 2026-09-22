import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { appendBookingToSheet } from "../../lib/booking/google-sheets";
import { sendBookingNotificationEmail } from "../../lib/booking/email";
import { ConfigurationError, getServerEnv } from "../../lib/server-env";
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
  const supabaseUrl =
    import.meta.env["VITE_SUPABASE_URL"] || getServerEnv("SUPABASE_URL");
  const supabaseKey =
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    getServerEnv("SUPABASE_PUBLISHABLE_KEY");

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

async function getAuthenticatedUser(request: Request) {
  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const supabase = getSupabaseClient(request);

  const token = authorization.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
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



          const supabase = getSupabaseClient(request);

          /*
           * Get the authenticated user when a Supabase
           * access token is provided.
           *
           * Guest bookings are still supported.
           */
          const user = await getAuthenticatedUser(request);

          /*
           * Find the selected published trip.
           *
           * The frontend can send either the trip UUID
           * or the trip slug.
           */
          let tripQuery = supabase
            .from("trips")
            .select("id, title, slug, price, capacity, status")
            .eq("status", "published");

          const isUuid = z.string().uuid().safeParse(booking.trip).success;

          if (isUuid) {
            tripQuery = tripQuery.eq("id", booking.trip);
          } else {
            tripQuery = tripQuery.eq("slug", booking.trip);
          }

          const { data: trip, error: tripError } =
            await tripQuery.maybeSingle();

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
           * Check trip capacity.
           *
           * The database function only returns the number of
           * confirmed + paid seats. It does not expose booking
           * records to the public user.
           *
           * If capacity is null, the trip has no seat limit and
           * the capacity check is skipped.
           */
          if (trip.capacity !== null) {
            const { data: bookedSeats, error: capacityError } =
              await supabase.rpc("get_confirmed_booked_seats", {
                p_trip_id: trip.id,
              });

            if (capacityError) {
              console.error(
                "Trip capacity check error:",
                capacityError,
              );

              return Response.json(
                {
                  success: false,
                  message:
                    "Could not verify trip availability. Please try again.",
                },
                { status: 500 },
              );
            }

            const totalBooked = Number(bookedSeats ?? 0);
            const remainingSeats = Math.max(
              trip.capacity - totalBooked,
              0,
            );

            if (booking.travellers > remainingSeats) {
              return Response.json(
                {
                  success: false,
                  message:
                    remainingSeats === 0
                      ? "This trip is fully booked."
                      : `Only ${remainingSeats} seat${
                          remainingSeats === 1 ? "" : "s"
                        } remaining for this trip.`,
                  availableSeats: remainingSeats,
                  requestedSeats: booking.travellers,
                },
                { status: 409 },
              );
            }
          }

          /*
           * Calculate the booking amount.
           */
          const totalAmount =
            trip.price !== null
              ? Number(trip.price) * booking.travellers
              : null;

          /*
           * Save the booking.
           *
           * Authenticated users are linked through user_id.
           * Guest bookings have user_id = null.
           *
           * New bookings start as in_progress because payment
           * is completed manually through UPI.
           */
          const { error: bookingError } = await supabase
            .from("bookings")
            .insert({
              id: booking.bookingId,
              user_id: user?.id ?? null,
              trip_id: trip.id,
              full_name: booking.name,
              email: booking.email,
              phone: booking.phone,
              number_of_people: booking.travellers,
              booking_date: booking.travelDate,
              special_requests: booking.message,
              status: "in_progress",
              total_amount: totalAmount,
              payment_status: "pending",
            });

          if (bookingError) {
            console.error("Supabase booking error:", bookingError);

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
            status: "in_progress",
            paymentStatus: "pending",
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
