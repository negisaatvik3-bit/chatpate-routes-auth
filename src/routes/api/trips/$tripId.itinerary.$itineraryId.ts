import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "../../../lib/server-env";
import { z } from "zod";

const updateItinerarySchema = z.object({
  day_number: z.number().int().positive().optional(),
  title: z.string().min(1, "Title is required").optional(),
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

export const Route = createFileRoute(
  "/api/trips/$tripId/itinerary/$itineraryId",
)({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          const body = await request.json();

          const result = updateItinerarySchema.safeParse(body);

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

          const { data: existingItinerary, error: existingError } =
            await admin.supabase
              .from("trip_itinerary")
              .select("id")
              .eq("id", params.itineraryId)
              .eq("trip_id", params.tripId)
              .single();

          if (existingError || !existingItinerary) {
            return Response.json(
              {
                success: false,
                message: "Itinerary entry not found.",
              },
              { status: 404 },
            );
          }

          const { data: itinerary, error } = await admin.supabase
            .from("trip_itinerary")
            .update(result.data)
            .eq("id", params.itineraryId)
            .eq("trip_id", params.tripId)
            .select()
            .single();

          if (error) {
            console.error("Update itinerary error:", error);

            return Response.json(
              {
                success: false,
                message:
                  error.code === "23505"
                    ? "An itinerary entry for this day already exists."
                    : "Could not update itinerary entry.",
              },
              { status: error.code === "23505" ? 409 : 500 },
            );
          }

          return Response.json({
            success: true,
            itinerary,
          });
        } catch (error) {
          console.error("Itinerary PATCH error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not update itinerary entry.",
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

          const { data: existingItinerary, error: existingError } =
            await admin.supabase
              .from("trip_itinerary")
              .select("id")
              .eq("id", params.itineraryId)
              .eq("trip_id", params.tripId)
              .single();

          if (existingError || !existingItinerary) {
            return Response.json(
              {
                success: false,
                message: "Itinerary entry not found.",
              },
              { status: 404 },
            );
          }

          const { error } = await admin.supabase
            .from("trip_itinerary")
            .delete()
            .eq("id", params.itineraryId)
            .eq("trip_id", params.tripId);

          if (error) {
            console.error("Delete itinerary error:", error);

            return Response.json(
              {
                success: false,
                message: "Could not delete itinerary entry.",
              },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            message: "Itinerary entry deleted successfully.",
          });
        } catch (error) {
          console.error("Itinerary DELETE error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not delete itinerary entry.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
