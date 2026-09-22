import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getServerEnv } from "../../../../lib/server-env";

const updateBookingSchema = z.object({
  status: z
    .enum([
      "in_progress",
      "pending",
      "confirmed",
      "cancelled",
      "completed",
    ])
    .optional(),

  payment_status: z
    .enum(["pending", "paid", "failed", "refunded"])
    .optional(),

  payment_id: z.string().optional().nullable(),

  special_requests: z.string().optional().nullable(),
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

async function requireAdmin(request: Request) {
  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      error: Response.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      ),
    };
  }

  const supabase = getSupabaseClient(request);

  const token = authorization.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return {
      error: Response.json(
        {
          success: false,
          message: "Invalid or expired authentication token.",
        },
        { status: 401 },
      ),
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return {
      error: Response.json(
        {
          success: false,
          message: "Administrator access required.",
        },
        { status: 403 },
      ),
    };
  }

  return {
    supabase,
    user,
  };
}

export const Route = createFileRoute("/api/admin/bookings/$bookingId")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          const body = await request.json();

          /*
           * Support both normal booking updates and the
           * manual UPI payment confirmation flow.
           */
          const result = updateBookingSchema.safeParse(body);

          if (!result.success) {
            return Response.json(
              {
                success: false,
                message: "Invalid booking update.",
                errors: result.error.flatten().fieldErrors,
              },
              { status: 400 },
            );
          }

          if (Object.keys(result.data).length === 0) {
            return Response.json(
              {
                success: false,
                message: "At least one booking field must be provided.",
              },
              { status: 400 },
            );
          }

          /*
           * Get the existing booking first.
           */
          const { data: existingBooking, error: existingError } =
            await admin.supabase
              .from("bookings")
              .select(`
                id,
                status,
                payment_status,
                number_of_people,
                trip_id
              `)
              .eq("id", params.bookingId)
              .single();

          if (existingError || !existingBooking) {
            return Response.json(
              {
                success: false,
                message: "Booking not found.",
              },
              { status: 404 },
            );
          }

          /*
           * Payment Successful action:
           *
           * When the admin marks payment as paid,
           * the booking must become confirmed.
           *
           * This prevents a booking from being marked
           * as paid while remaining in_progress.
           */
          const updates = {
            ...result.data,
            updated_at: new Date().toISOString(),
          };

          if (result.data.payment_status === "paid") {
            updates.status = "confirmed";
          }

          /*
           * If the admin explicitly confirms the booking,
           * make sure payment is also marked paid.
           */
          if (result.data.status === "confirmed") {
            updates.payment_status = "paid";
          }

          const { data: booking, error } = await admin.supabase
            .from("bookings")
            .update(updates)
            .eq("id", params.bookingId)
            .select(`
              *,
              trip:trips (
                id,
                title,
                slug,
                destination,
                start_date,
                end_date,
                price
              )
            `)
            .single();

          if (error) {
            console.error("Update booking error:", error);

            return Response.json(
              {
                success: false,
                message: "Could not update booking.",
              },
              { status: 500 },
            );
          }

          const paymentConfirmed =
            booking.status === "confirmed" &&
            booking.payment_status === "paid";

          return Response.json({
            success: true,
            message: paymentConfirmed
              ? "Payment confirmed and booking confirmed successfully."
              : "Booking updated successfully.",
            booking,
          });
        } catch (error) {
          console.error("Admin booking PATCH error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not update booking.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
