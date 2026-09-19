import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "../../../lib/server-env";

function getSupabaseClient(request: Request) {
  const supabaseUrl =
    getServerEnv("SUPABASE_URL") ||
    import.meta.env["VITE_SUPABASE_URL"];

  const supabaseKey =
    getServerEnv("SUPABASE_PUBLISHABLE_KEY") ||
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

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

export const Route = createFileRoute("/api/admin/trips")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          const url = new URL(request.url);

          const search = url.searchParams.get("search")?.trim() ?? "";
          const status = url.searchParams.get("status");
          const tripType = url.searchParams.get("trip_type");

          const allowedStatuses = [
            "draft",
            "published",
            "archived",
          ];

          if (status && !allowedStatuses.includes(status)) {
            return Response.json(
              {
                success: false,
                message: "Invalid trip status.",
              },
              { status: 400 },
            );
          }

          let query = admin.supabase
            .from("trips")
            .select(`
              *,
              trip_images (
                id,
                image_url,
                is_cover,
                display_order
              ),
              trip_itinerary (
                id,
                day_number,
                title,
                description
              )
            `)
            .order("created_at", { ascending: false });

          if (search) {
            query = query.or(
              `title.ilike.%${search}%,destination.ilike.%${search}%`,
            );
          }

          if (status) {
            query = query.eq("status", status);
          }

          if (tripType) {
            query = query.eq("trip_type", tripType);
          }

          const { data: trips, error } = await query;

          if (error) {
            console.error("Get admin trips error:", error);

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
            count: trips?.length ?? 0,
          });
        } catch (error) {
          console.error("Admin trips GET error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not retrieve trips.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
