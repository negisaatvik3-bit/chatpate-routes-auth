import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "../../../lib/server-env";

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const authorization = request.headers.get("Authorization");

        if (!authorization?.startsWith("Bearer ")) {
          return json({ success: false, message: "Authentication required." }, 401);
        }

        const supabaseUrl = getServerEnv("SUPABASE_URL") || import.meta.env["VITE_SUPABASE_URL"];
        const supabaseKey =
          getServerEnv("SUPABASE_PUBLISHABLE_KEY") ||
          import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

        if (!supabaseUrl || !supabaseKey) {
          return json({ success: false, message: "Account status is unavailable." }, 503);
        }

        try {
          const supabase = createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: authorization } },
          });
          const token = authorization.slice("Bearer ".length);
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser(token);

          if (userError || !user) {
            return json({ success: false, message: "Session is invalid or expired." }, 401);
          }

          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();

          if (profileError) {
            return json({ success: false, message: "Could not verify account access." }, 503);
          }

          return json({
            success: true,
            email: user.email ?? null,
            isAdmin: profile?.role === "admin",
          });
        } catch {
          return json({ success: false, message: "Could not verify account access." }, 503);
        }
      },
    },
  },
});
