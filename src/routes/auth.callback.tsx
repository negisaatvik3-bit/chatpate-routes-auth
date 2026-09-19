import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { supabase } from "@/integerations/supabase/client";
import { getSafeRedirectPath } from "@/lib/auth";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [{ title: "Signing in — Chatpate Routes" }],
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const [adminAttempt, setAdminAttempt] = useState(false);

  useEffect(() => {
    let active = true;

    const completeSignIn = async () => {
      const params = new URLSearchParams(window.location.search);
      const next = getSafeRedirectPath(params.get("next"), "/");
      setAdminAttempt(params.get("admin") === "1");

      try {
        const {
          data: { session: existingSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        let session = existingSession;
        const code = params.get("code");

        if (!session && code) {
          const { data, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) throw exchangeError;
          session = data.session;
        }

        if (!session) {
          throw new Error("Google sign-in did not return an active session.");
        }

        if (params.get("admin") === "1") {
          const response = await fetch("/api/admin/trips", {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          const result = (await response.json().catch(() => ({}))) as {
            message?: string;
          };

          if (!response.ok) {
            await supabase.auth.signOut();

            throw new Error(
              response.status === 403
                ? "This Google account is not authorised for admin access."
                : result.message || "Admin access could not be verified.",
            );
          }
        }

        if (active) {
          window.location.replace(next);
        }
      } catch (signInError) {
        console.error("Google sign-in callback error:", signInError);

        if (active) {
          setError(
            signInError instanceof Error
              ? signInError.message
              : "Unable to complete Google sign-in.",
          );
        }
      }
    };

    completeSignIn();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground">
          {error ? "Sign-in unavailable" : "Signing you in"}
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
          {error || "Please wait while we finish connecting your Google account."}
        </p>
        {error ? (
          <Link
            to={adminAttempt ? "/admin/login" : "/login"}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to sign in
          </Link>
        ) : null}
      </div>
    </AuthLayout>
  );
}
