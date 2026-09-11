import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getServerEnv } from "../../lib/server-env";

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
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  cover_image_url: z.string().url().optional().nullable(),
});

function getSupabaseClient(request: Request) {
  const supabaseUrl =
    getServerEnv("SUPABASE_URL") ||
    import.meta.env["VITE_SUPABASE_URL"];

  const supabaseKey =
    getServerEnv("SUPABASE_PUBLISHABLE_KEY") ||
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

  if (!supabaseUrl) {
    throw new Error("Missing Supabase URL configuration.");
  }

  if (!supabaseKey) {
    throw new Error("Missing Supabase publishable key configuration.");
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

          const { data, error } = await supabase
            .from("trips")
            .select("*")
            .eq("status", "published")
            .order("created_at", { ascending: false });

          if (error) {
            console.error("Error fetching trips:", error);

            return Response.json(
              {
                success: false,
                message: "Could not retrieve trips.",
                error: error.message,
              },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            trips: data ?? [],
          });
        } catch (error) {
          console.error("GET /api/trips error:", error);

          return Response.json(
            {
              success: false,
              message:
                error instanceof Error
                  ? error.message
                  : "Could not retrieve trips.",
            },
            { status: 500 },
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const auth = await requireAdmin(request);

          if ("error" in auth) {
            return auth.error;
          }

          const body = await request.json();
          const parsed = tripSchema.safeParse(body);

          if (!parsed.success) {
            return Response.json(
              {
                success: false,
                message: "Invalid trip data.",
                errors: parsed.error.flatten(),
              },
              { status: 400 },
            );
          }

          const { data, error } = await auth.supabase
            .from("trips")
            .insert(parsed.data)
            .select("*")
            .single();

          if (error) {
            console.error("Error creating trip:", error);

            return Response.json(
              {
                success: false,
                message: "Could not create trip.",
                error: error.message,
              },
              { status: 500 },
            );
          }

          return Response.json(
            {
              success: true,
              trip: data,
            },
            { status: 201 },
          );
        } catch (error) {
          console.error("POST /api/trips error:", error);

          return Response.json(
            {
              success: false,
              message:
                error instanceof Error
                  ? error.message
                  : "Could not create trip.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});