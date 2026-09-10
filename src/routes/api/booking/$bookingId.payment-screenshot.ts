import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = "payment-screenshots";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

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

export const Route = createFileRoute(
  "/api/booking/$bookingId/payment-screenshot",
)({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        try {
          const supabase = getSupabaseClient(request);

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

          const token = authorization.replace("Bearer ", "");

          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser(token);

          if (userError || !user) {
            return Response.json(
              {
                success: false,
                message: "Invalid or expired authentication token.",
              },
              { status: 401 },
            );
          }

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
            .select("id, user_id, status, payment_status")
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

          if (booking.user_id !== user.id) {
            return Response.json(
              {
                success: false,
                message: "You are not allowed to update this booking.",
              },
              { status: 403 },
            );
          }

          if (
            booking.status === "cancelled" ||
            booking.status === "completed"
          ) {
            return Response.json(
              {
                success: false,
                message: "Payment screenshot cannot be uploaded for this booking.",
              },
              { status: 400 },
            );
          }

          const formData = await request.formData();
          const file = formData.get("screenshot");

          if (!(file instanceof File)) {
            return Response.json(
              {
                success: false,
                message: "Payment screenshot file is required.",
              },
              { status: 400 },
            );
          }

          if (!ALLOWED_TYPES.has(file.type)) {
            return Response.json(
              {
                success: false,
                message: "Only JPG, PNG, and WebP images are allowed.",
              },
              { status: 400 },
            );
          }

          if (file.size > MAX_FILE_SIZE) {
            return Response.json(
              {
                success: false,
                message: "Payment screenshot must be 5 MB or smaller.",
              },
              { status: 400 },
            );
          }

          const extension =
            file.type === "image/jpeg"
              ? "jpg"
              : file.type === "image/png"
                ? "png"
                : "webp";

          const storagePath = `bookings/${bookingId}/payment-screenshot-${Date.now()}.${extension}`;

          const fileBuffer = await file.arrayBuffer();

          const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, fileBuffer, {
              contentType: file.type,
              upsert: false,
            });

          if (uploadError) {
            console.error("Payment screenshot upload error:", uploadError);

            return Response.json(
              {
                success: false,
                message: "Failed to upload payment screenshot.",
              },
              { status: 500 },
            );
          }

          const { data: updatedBooking, error: updateError } = await supabase
            .from("bookings")
            .update({
              payment_screenshot_url: storagePath,
              updated_at: new Date().toISOString(),
            })
            .eq("id", bookingId)
            .eq("user_id", user.id)
            .select("id, payment_screenshot_url, status, payment_status")
            .single();

          if (updateError || !updatedBooking) {
            await supabase.storage
              .from(BUCKET_NAME)
              .remove([storagePath]);

            console.error(
              "Payment screenshot database update error:",
              updateError,
            );

            return Response.json(
              {
                success: false,
                message: "Failed to save payment screenshot information.",
              },
              { status: 500 },
            );
          }

          return Response.json(
            {
              success: true,
              message: "Payment screenshot uploaded successfully.",
              booking: updatedBooking,
            },
            { status: 200 },
          );
        } catch (error) {
          console.error("Payment screenshot API error:", error);

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