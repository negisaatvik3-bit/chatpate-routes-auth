import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

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

export const Route = createFileRoute("/api/admin/bookings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          const url = new URL(request.url);

          const status = url.searchParams.get("status");

          let query = admin.supabase
            .from("bookings")
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
            .order("created_at", { ascending: false });

          if (status) {
            const allowedStatuses = [
              "in_progress",
              "pending",
              "confirmed",
              "cancelled",
              "completed",
            ];

            if (!allowedStatuses.includes(status)) {
              return Response.json(
                {
                  success: false,
                  message: "Invalid booking status.",
                },
                { status: 400 },
              );
            }

            query = query.eq("status", status);
          }

          const { data: bookings, error } = await query;

          if (error) {
            console.error("Get admin bookings error:", error);

            return Response.json(
              {
                success: false,
                message: "Could not retrieve bookings.",
              },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            bookings,
            count: bookings?.length ?? 0,
          });
        } catch (error) {
          console.error("Admin bookings GET error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not retrieve bookings.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});