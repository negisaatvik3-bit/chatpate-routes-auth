import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const updateBookingSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "cancelled", "completed"])
    .optional(),

  payment_status: z
    .enum(["pending", "paid", "failed", "refunded"])
    .optional(),

  payment_id: z.string().optional().nullable(),

  special_requests: z.string().optional().nullable(),
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

          const { data: existingBooking, error: existingError } =
            await admin.supabase
              .from("bookings")
              .select("id")
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

          const { data: booking, error } = await admin.supabase
            .from("bookings")
            .update({
              ...result.data,
              updated_at: new Date().toISOString(),
            })
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

          return Response.json({
            success: true,
            message: "Booking updated successfully.",
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