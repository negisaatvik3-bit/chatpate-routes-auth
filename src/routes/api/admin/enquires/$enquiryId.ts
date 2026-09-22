import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getServerEnv } from "../../../../lib/server-env";

const updateEnquirySchema = z.object({
  status: z.enum(["new", "contacted", "resolved"]),
});

function getSupabaseClient(request: Request) {
  const supabaseUrl =
    import.meta.env["VITE_SUPABASE_URL"] || getServerEnv("SUPABASE_URL");
  const supabaseKey =
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    getServerEnv("SUPABASE_PUBLISHABLE_KEY");

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
  "/api/admin/enquires/$enquiryId",
)({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        try {
          const admin = await requireAdmin(request);

          if ("error" in admin) {
            return admin.error;
          }

          const body = await request.json();

          const result = updateEnquirySchema.safeParse(body);

          if (!result.success) {
            return Response.json(
              {
                success: false,
                message: "Invalid enquiry update.",
                errors: result.error.flatten().fieldErrors,
              },
              { status: 400 },
            );
          }

          const { data: existingEnquiry, error: existingError } =
            await admin.supabase
              .from("enquiries")
              .select("id")
              .eq("id", params.enquiryId)
              .single();

          if (existingError || !existingEnquiry) {
            return Response.json(
              {
                success: false,
                message: "Enquiry not found.",
              },
              { status: 404 },
            );
          }

          const { data: enquiry, error } = await admin.supabase
            .from("enquiries")
            .update({
              status: result.data.status,
              updated_at: new Date().toISOString(),
            })
            .eq("id", params.enquiryId)
            .select(`
              *,
              trip:trips (
                id,
                title,
                slug,
                destination,
                start_date,
                end_date
              )
            `)
            .single();

          if (error) {
            console.error("Update enquiry error:", error);

            return Response.json(
              {
                success: false,
                message: "Could not update enquiry.",
              },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            message: "Enquiry updated successfully.",
            enquiry,
          });
        } catch (error) {
          console.error("Admin enquiry PATCH error:", error);

          return Response.json(
            {
              success: false,
              message: "Could not update enquiry.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
