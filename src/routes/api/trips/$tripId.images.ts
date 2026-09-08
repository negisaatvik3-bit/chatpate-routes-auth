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

export const Route = createFileRoute("/api/trips/$tripId/images")({
  server: {
    handlers: {
      // ============================================
      // POST /api/trips/:tripId/images
      // ============================================

      POST: async ({ request, params }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          // Check that the trip exists
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

          // Read multipart/form-data
          const formData = await request.formData();

          const file = formData.get("file");

          if (!(file instanceof File)) {
            return Response.json(
              {
                success: false,
                message: "Image file is required.",
              },
              { status: 400 },
            );
          }

          // Only allow image files
          if (!file.type.startsWith("image/")) {
            return Response.json(
              {
                success: false,
                message: "Only image files are allowed.",
              },
              { status: 400 },
            );
          }

          // Generate unique filename
          const extension = file.name.split(".").pop() || "jpg";
          const fileName = `${crypto.randomUUID()}.${extension}`;

          // Store image inside a folder for this trip
          const storagePath = `${params.tripId}/${fileName}`;

          // Upload image to Supabase Storage
          const { error: uploadError } = await admin.supabase.storage
            .from("trip-images")
            .upload(storagePath, file, {
              contentType: file.type,
              upsert: false,
            });

          if (uploadError) {
            console.error("Image upload error:", uploadError);

            return Response.json(
              {
                success: false,
                message: "Could not upload image.",
              },
              { status: 500 },
            );
          }

          // Get public URL
          const {
            data: { publicUrl },
          } = admin.supabase.storage
            .from("trip-images")
            .getPublicUrl(storagePath);

          // Optional cover image
          const isCover = formData.get("is_cover") === "true";

          // Optional display order
          const displayOrderValue = formData.get("display_order");

          const displayOrder = displayOrderValue
            ? Number(displayOrderValue)
            : 0;

          // If this is the cover image,
          // remove cover status from other images
          if (isCover) {
            await admin.supabase
              .from("trip_images")
              .update({ is_cover: false })
              .eq("trip_id", params.tripId);
          }

          // Save image information in database
          const { data: image, error: imageError } = await admin.supabase
            .from("trip_images")
            .insert({
              trip_id: params.tripId,
              storage_path: storagePath,
              image_url: publicUrl,
              is_cover: isCover,
              display_order: displayOrder,
            })
            .select()
            .single();

          if (imageError) {
            console.error("Trip image database error:", imageError);

            // Delete uploaded file if database insert fails
            await admin.supabase.storage
              .from("trip-images")
              .remove([storagePath]);

            return Response.json(
              {
                success: false,
                message: "Could not save image information.",
              },
              { status: 500 },
            );
          }

          return Response.json(
            {
              success: true,
              image,
            },
            { status: 201 },
          );
        } catch (error) {
          console.error("Trip image POST error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not upload trip image.",
            },
            { status: 500 },
          );
        }
      },

      // ============================================
      // GET /api/trips/:tripId/images
      // ============================================

      GET: async ({ request, params }) => {
        try {
          const supabase = getSupabaseClient(request);

          const { data: images, error } = await supabase
            .from("trip_images")
            .select("*")
            .eq("trip_id", params.tripId)
            .order("display_order", { ascending: true });

          if (error) {
            console.error("Get trip images error:", error);

            return Response.json(
              {
                success: false,
                message: "Could not retrieve trip images.",
              },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            images,
          });
        } catch (error) {
          console.error("Trip images GET error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not retrieve trip images.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});