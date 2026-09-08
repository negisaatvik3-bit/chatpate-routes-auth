import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const tripSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),

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

  included: z.array(z.string()).default([]),

  what_to_bring: z.array(z.string()).default([]),

  rules: z.array(z.string()).default([]),

  faq: z
    .array(
      z.object({
        question: z.string().min(1, "FAQ question is required"),
        answer: z.string().min(1, "FAQ answer is required"),
      }),
    )
    .default([]),

  status: z
    .enum(["draft", "published", "archived"])
    .default("draft"),

  cover_image_url: z.string().url().optional().nullable(),
});

const updateTripSchema = tripSchema.partial();

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

export const Route = createFileRoute("/api/trips")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const supabase = getSupabaseClient(request);

          const { data: trips, error } = await supabase
            .from("trips")
            .select("*")
            .eq("status", "published")
            .order("created_at", { ascending: false });

          if (error) {
            console.error("Get trips error:", error);

            return Response.json(
              {
                success: false,
                message: "Could not retrieve trips.",
              },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            trips,
          });
        } catch (error) {
          console.error("Trips GET error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not retrieve trips.",
            },
            { status: 500 },
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          const body = await request.json();

          const result = tripSchema.safeParse(body);

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

          const { data: trip, error } = await admin.supabase
            .from("trips")
            .insert(result.data)
            .select()
            .single();

          if (error) {
            console.error("Create trip error:", error);

            return Response.json(
              {
                success: false,
                message:
                  error.code === "23505"
                    ? "A trip with this slug already exists."
                    : "Could not create trip.",
              },
              {
                status: error.code === "23505" ? 409 : 500,
              },
            );
          }

          return Response.json(
            {
              success: true,
              trip,
            },
            { status: 201 },
          );
        } catch (error) {
          console.error("Trips POST error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not create trip.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});