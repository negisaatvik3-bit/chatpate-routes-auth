import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

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

const updateTripSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  short_description: z.string().optional().nullable(),
  destination: z.string().optional().nullable(),
  trip_type: z.string().optional().nullable(),
  duration_days: z.number().int().positive().optional().nullable(),
  price: z.number().nonnegative().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  capacity: z.number().int().positive().optional().nullable(),
  group_size: z.string().optional().nullable(),
  accommodation: z.string().optional().nullable(),
  accommodation_description: z.string().optional().nullable(),
  stay_location: z.string().optional().nullable(),
  included: z.array(z.string()).optional(),
  what_to_bring: z.array(z.string()).optional(),
  rules: z.array(z.string()).optional(),
  faq: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  cover_image_url: z.string().url().optional().nullable(),
});

export const Route = createFileRoute("/api/admin/trips/$tripId")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          const tripId = params.tripId;

          // Get trip
          const { data: trip, error: tripError } = await admin.supabase
            .from("trips")
            .select("*")
            .eq("id", tripId)
            .single();

          if (tripError) {
            if (tripError.code === "PGRST116") {
              return Response.json(
                {
                  success: false,
                  message: "Trip not found.",
                },
                { status: 404 },
              );
            }

            console.error("Get admin trip error:", tripError);

            return Response.json(
              {
                success: false,
                message: "Could not retrieve trip.",
              },
              { status: 500 },
            );
          }

          // Get itinerary
          const { data: itinerary, error: itineraryError } =
            await admin.supabase
              .from("trip_itinerary")
              .select("*")
              .eq("trip_id", tripId)
              .order("day_number", { ascending: true });

          if (itineraryError) {
            console.error(
              "Get trip itinerary error:",
              itineraryError,
            );

            return Response.json(
              {
                success: false,
                message: "Could not retrieve trip itinerary.",
              },
              { status: 500 },
            );
          }

          // Get images
          const { data: images, error: imagesError } =
            await admin.supabase
              .from("trip_images")
              .select("*")
              .eq("trip_id", tripId)
              .order("display_order", { ascending: true });

          if (imagesError) {
            console.error("Get trip images error:", imagesError);

            return Response.json(
              {
                success: false,
                message: "Could not retrieve trip images.",
              },
              { status: 500 },
            );
          }

          // Get bookings
          const { data: bookings, error: bookingsError } =
            await admin.supabase
              .from("bookings")
              .select(`
                id,
                user_id,
                trip_id,
                full_name,
                email,
                phone,
                number_of_people,
                booking_date,
                special_requests,
                status,
                payment_status,
                payment_id,
                total_amount,
                created_at,
                updated_at
              `)
              .eq("trip_id", tripId)
              .order("created_at", { ascending: false });

          if (bookingsError) {
            console.error("Get trip bookings error:", bookingsError);

            return Response.json(
              {
                success: false,
                message: "Could not retrieve trip bookings.",
              },
              { status: 500 },
            );
          }

          // Only confirmed + paid bookings count toward booked seats.
          const totalBooked = (bookings ?? [])
            .filter(
              (booking) =>
                booking.status === "confirmed" &&
                booking.payment_status === "paid",
            )
            .reduce(
              (total, booking) =>
                total + booking.number_of_people,
              0,
            );

          // Get enquiries
          const { data: enquiries, error: enquiriesError } =
            await admin.supabase
              .from("enquiries")
              .select(`
                id,
                name,
                email,
                phone,
                message,
                status,
                created_at,
                updated_at
              `)
              .eq("trip_id", tripId)
              .order("created_at", { ascending: false });

          if (enquiriesError) {
            console.error(
              "Get trip enquiries error:",
              enquiriesError,
            );

            return Response.json(
              {
                success: false,
                message: "Could not retrieve trip enquiries.",
              },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,

            trip,

            overview: {
              totalSeats: trip.capacity,
              totalBooked,
              availableSeats:
                trip.capacity !== null
                  ? Math.max(trip.capacity - totalBooked, 0)
                  : null,
              durationDays: trip.duration_days,
              price: trip.price,
            },

            itinerary: itinerary ?? [],
            images: images ?? [],
            bookings: bookings ?? [],
            enquiries: enquiries ?? [],
          });
        } catch (error) {
          console.error("Admin trip GET error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not retrieve trip details.",
            },
            { status: 500 },
          );
        }
      },

      PATCH: async ({ request, params }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          const body = await request.json();

          const updates = updateTripSchema.parse(body);

          const { data: trip, error } = await admin.supabase
            .from("trips")
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq("id", params.tripId)
            .select("*")
            .single();

          if (error) {
            if (error.code === "PGRST116") {
              return Response.json(
                {
                  success: false,
                  message: "Trip not found.",
                },
                { status: 404 },
              );
            }

            console.error("Update admin trip error:", error);

            return Response.json(
              {
                success: false,
                message: "Could not update trip.",
              },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            message: "Trip updated successfully.",
            trip,
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json(
              {
                success: false,
                message: "Invalid trip data.",
                details: error.errors,
              },
              { status: 400 },
            );
          }

          console.error("Admin trip PATCH error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not update trip.",
            },
            { status: 500 },
          );
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          const { data: existingTrip, error: findError } =
            await admin.supabase
              .from("trips")
              .select("id")
              .eq("id", params.tripId)
              .single();

          if (findError) {
            if (findError.code === "PGRST116") {
              return Response.json(
                {
                  success: false,
                  message: "Trip not found.",
                },
                { status: 404 },
              );
            }

            throw findError;
          }

          const { error: deleteError } = await admin.supabase
            .from("trips")
            .delete()
            .eq("id", existingTrip.id);

          if (deleteError) {
            console.error(
              "Delete admin trip error:",
              deleteError,
            );

            return Response.json(
              {
                success: false,
                message: "Could not delete trip.",
              },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            message: "Trip deleted successfully.",
          });
        } catch (error) {
          console.error("Admin trip DELETE error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not delete trip.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});