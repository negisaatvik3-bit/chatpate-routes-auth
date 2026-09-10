import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = "payment-screenshots";

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

export const Route = createFileRoute(
  "/api/admin/bookings/$bookingId/payment-screenshot",
)({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const auth = await requireAdmin(request);

          if ("error" in auth) {
            return auth.error;
          }

          const { supabase } = auth;
          const bookingId = params.bookingId;

          if (!bookingId) {
            return Response.json(
              {
                success: false,
                message: "Booking ID is required.",
              },
              { status: 400 },
            );
          }

          const { data: booking, error: bookingError } = await supabase
            .from("bookings")
            .select("id, payment_screenshot_url")
            .eq("id", bookingId)
            .single();

          if (bookingError || !booking) {
            return Response.json(
              {
                success: false,
                message: "Booking not found.",
              },
              { status: 404 },
            );
          }

          if (!booking.payment_screenshot_url) {
            return Response.json(
              {
                success: false,
                message: "No payment screenshot has been uploaded for this booking.",
              },
              { status: 404 },
            );
          }

          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from(BUCKET_NAME)
              .createSignedUrl(
                booking.payment_screenshot_url,
                60 * 10,
              );

          if (signedUrlError || !signedUrlData?.signedUrl) {
            console.error(
              "Payment screenshot signed URL error:",
              signedUrlError,
            );

            return Response.json(
              {
                success: false,
                message: "Failed to generate payment screenshot URL.",
              },
              { status: 500 },
            );
          }

          return Response.json(
            {
              success: true,
              bookingId: booking.id,
              screenshotUrl: signedUrlData.signedUrl,
              expiresIn: 600,
            },
            { status: 200 },
          );
        } catch (error) {
          console.error(
            "Admin payment screenshot API error:",
            error,
          );

          return Response.json(
            {
              success: false,
              message: "Internal server error.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});