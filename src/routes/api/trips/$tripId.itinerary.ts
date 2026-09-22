import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "../../../lib/server-env";
import { z } from "zod";

const itinerarySchema = z.object({
  day_number: z.number().int().positive(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
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

export const Route = createFileRoute("/api/trips/$tripId/itinerary")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const supabase = getSupabaseClient(request);

          const { data: itinerary, error } = await supabase
            .from("trip_itinerary")
            .select("*")
            .eq("trip_id", params.tripId)
            .order("day_number", { ascending: true });

          if (error) {
            console.error("Get itinerary error:", error);

            return Response.json(
              {
                success: false,
                message: "Could not retrieve trip itinerary.",
              },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            itinerary,
          });
        } catch (error) {
          console.error("Itinerary GET error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not retrieve trip itinerary.",
            },
            { status: 500 },
          );
        }
      },

      POST: async ({ request, params }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          // Make sure the trip exists.
          const { data: trip, error: tripError } = await admin.supabase
            .from("trips")
            .select("id")
            .eq("id", params.tripId)
            .single();

          if (tripError || !trip) {
            return Response.json(
              {
                success: false,
                message: "Trip not found.",
              },
              { status: 404 },
            );
          }

          const body = await request.json();

          const result = itinerarySchema.safeParse(body);

          if (!result.success) {
            return Response.json(
              {
                success: false,
                message: "Invalid itinerary details.",
                errors: result.error.flatten().fieldErrors,
              },
              { status: 400 },
            );
          }

          const { data: itinerary, error } = await admin.supabase
            .from("trip_itinerary")
            .insert({
              trip_id: params.tripId,
              ...result.data,
            })
            .select()
            .single();

          if (error) {
            console.error("Create itinerary error:", error);

            return Response.json(
              {
                success: false,
                message:
                  error.code === "23505"
                    ? "An itinerary entry for this day already exists."
                    : "Could not create itinerary entry.",
              },
              { status: error.code === "23505" ? 409 : 500 },
            );
          }

          return Response.json(
            {
              success: true,
              itinerary,
            },
            { status: 201 },
          );
        } catch (error) {
          console.error("Itinerary POST error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not create itinerary entry.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
