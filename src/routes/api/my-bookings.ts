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

export const Route = createFileRoute("/api/my-bookings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const authorization = request.headers.get("Authorization");

          if (!authorization?.startsWith("Bearer ")) {
            return Response.json(
              {
                success: false,
                message: "Authentication required.",
              },
              { status: 401 },
            );
          }

          const supabase = getSupabaseClient(request);

          const token = authorization.replace("Bearer ", "");

          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser(token);

          if (authError || !user) {
            return Response.json(
              {
                success: false,
                message: "Invalid or expired authentication token.",
              },
              { status: 401 },
            );
          }

          const { data: bookings, error } = await supabase
            .from("bookings")
            .select(`
              id,
              full_name,
              email,
              phone,
              number_of_people,
              booking_date,
              special_requests,
              status,
              total_amount,
              payment_status,
              payment_id,
              created_at,
              updated_at,
              trip:trips (
                id,
                title,
                slug,
                destination,
                duration_days,
                price,
                start_date,
                end_date,
                cover_image_url
              )
            `)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) {
            console.error("Get my bookings error:", error);

            return Response.json(
              {
                success: false,
                message: "Could not retrieve your bookings.",
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
          console.error("My bookings GET error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not retrieve your bookings.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});