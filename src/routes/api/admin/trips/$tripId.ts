import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const updateTripSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  slug: z.string().min(1, "Slug is required").optional(),

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
        question: z.string().min(1, "FAQ question is required"),
        answer: z.string().min(1, "FAQ answer is required"),
      }),
    )
    .optional(),

  status: z.enum(["draft", "published", "archived"]).optional(),

  cover_image_url: z.string().url().optional().nullable(),
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

export const Route = createFileRoute("/api/admin/trips/$tripId")({
  server: {
    handlers: {
      // Public: Get a published trip using its slug
      GET: async ({ request, params }) => {
        try {
          const supabase = getSupabaseClient(request);

          const { data: trip, error } = await supabase
            .from("trips")
            .select("*")
            .eq("slug", params.tripId)
            .eq("status", "published")
            .single();

          if (error || !trip) {
            console.error("Trip detail Supabase error:", error);
            console.error("Trip detail slug:", params.tripId);

            return Response.json(
              {
                success: false,
                message: error?.message || "Trip not found.",
                code: error?.code || null,
                details: error?.details || null,
                hint: error?.hint || null,
              },
              { status: 404 },
            );
          }

          return Response.json({
            success: true,
            trip,
          });
        } catch (error) {
          console.error("Trip GET error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not retrieve trip.",
            },
            { status: 500 },
          );
        }
      },

      // Admin: Update a trip using its slug
      PATCH: async ({ request, params }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          const body = await request.json();

          const result = updateTripSchema.safeParse(body);

          if (!result.success) {
            return Response.json(
              {
                success: false,
                message: "Invalid trip details.",
                errors: result.error.flatten().fieldErrors,
              },
              { status: 400 },
            );
          }

          if (Object.keys(result.data).length === 0) {
            return Response.json(
              {
                success: false,
                message: "At least one trip field must be provided.",
              },
              { status: 400 },
            );
          }

          const { data: existingTrip, error: existingError } =
            await admin.supabase
              .from("trips")
              .select("id")
              .eq("slug", params.tripId)
              .single();

          if (existingError || !existingTrip) {
            return Response.json(
              {
                success: false,
                message: "Trip not found.",
              },
              { status: 404 },
            );
          }

          const { data: trip, error } = await admin.supabase
            .from("trips")
            .update({
              ...result.data,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingTrip.id)
            .select()
            .single();

          if (error) {
            console.error("Update trip error:", error);

            return Response.json(
              {
                success: false,
                message:
                  error.code === "23505"
                    ? "A trip with this slug already exists."
                    : "Could not update trip.",
              },
              {
                status: error.code === "23505" ? 409 : 500,
              },
            );
          }

          return Response.json({
            success: true,
            trip,
          });
        } catch (error) {
          console.error("Trip PATCH error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not update trip.",
            },
            { status: 500 },
          );
        }
      },

      // Admin: Delete a trip using its slug
      DELETE: async ({ request, params }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          const { data: existingTrip, error: existingError } =
            await admin.supabase
              .from("trips")
              .select("id")
              .eq("slug", params.tripId)
              .single();

          if (existingError || !existingTrip) {
            return Response.json(
              {
                success: false,
                message: "Trip not found.",
              },
              { status: 404 },
            );
          }

          const { error } = await admin.supabase
            .from("trips")
            .delete()
            .eq("id", existingTrip.id);

          if (error) {
            console.error("Delete trip error:", error);

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
          console.error("Trip DELETE error:", error);

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