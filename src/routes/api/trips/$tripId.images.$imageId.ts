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

export const Route = createFileRoute(
  "/api/trips/$tripId/images/$imageId",
)({
  server: {
    handlers: {
      DELETE: async ({ request, params }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          // Find the image and make sure it belongs to this trip
          const { data: image, error: imageError } = await admin.supabase
            .from("trip_images")
            .select("id, storage_path")
            .eq("id", params.imageId)
            .eq("trip_id", params.tripId)
            .single();

          if (imageError || !image) {
            return Response.json(
              {
                success: false,
                message: "Trip image not found.",
              },
              { status: 404 },
            );
          }

          // Delete the physical file from Storage
          const { error: storageError } = await admin.supabase.storage
            .from("trip-images")
            .remove([image.storage_path]);

          if (storageError) {
            console.error(
              "Storage image delete error:",
              storageError,
            );

            return Response.json(
              {
                success: false,
                message: "Could not delete image from storage.",
              },
              { status: 500 },
            );
          }

          // Delete the database record
          const { error: deleteError } = await admin.supabase
            .from("trip_images")
            .delete()
            .eq("id", params.imageId)
            .eq("trip_id", params.tripId);

          if (deleteError) {
            console.error(
              "Trip image database delete error:",
              deleteError,
            );

            return Response.json(
              {
                success: false,
                message: "Could not delete image information.",
              },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            message: "Trip image deleted successfully.",
          });
        } catch (error) {
          console.error("Trip image DELETE error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not delete trip image.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});