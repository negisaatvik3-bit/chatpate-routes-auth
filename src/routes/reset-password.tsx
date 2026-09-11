import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integerations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set New Password | Chatpate Routes" },
      {
        name: "description",
        content: "Set a new password for your Chatpate Routes account.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeRecovery = async () => {
      try {
        /*
         * Supabase automatically processes the recovery tokens
         * from the URL when detectSessionInUrl is enabled (default).
         */

        const hashParams = new URLSearchParams(
          window.location.hash.replace(/^#/, ""),
        );

        const queryParams = new URLSearchParams(window.location.search);

        const errorDescription =
          hashParams.get("error_description") ||
          queryParams.get("error_description");

        const errorCode =
          hashParams.get("error_code") ||
          queryParams.get("error_code");

        if (errorDescription || errorCode) {
          if (mounted) {
            setError(
              errorDescription
                ? decodeURIComponent(errorDescription.replace(/\+/g, " "))
                : "This password recovery link is invalid or has expired.",
            );
            setLoading(false);
          }
          return;
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          if (mounted) {
            setError(
              "This password recovery link is invalid or has expired. Please request a new password reset email.",
            );
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setRecoveryReady(true);
          setLoading(false);
        }

        /*
         * Remove the access token from the browser URL after
         * Supabase has established the session.
         */
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.search,
        );
      } catch (err) {
        console.error("Password recovery initialization error:", err);

        if (mounted) {
          setError(
            "We couldn't verify this recovery link. Please request a new password reset email.",
          );
          setLoading(false);
        }
      }
    };

    initializeRecovery();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session && mounted) {
        setRecoveryReady(true);
        setLoading(false);
        setError(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setUpdating(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        console.error("Password update error:", updateError);

        setError(
          updateError.message ||
            "Unable to update your password. The recovery link may have expired.",
        );

        return;
      }

      setSuccess(true);

      /*
       * Give the user a moment to see the success message,
       * then send them to the admin login page.
       */
      setTimeout(() => {
        navigate({
          to: "/admin/login",
          replace: true,
        });
      }, 1200);
    } catch (err) {
      console.error("Password reset error:", err);

      setError(
        "Something went wrong while updating your password. Please try again.",
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AuthLayout>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground">
            Verifying reset link
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Please wait while we verify your password recovery link.
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (!recoveryReady) {
    return (
      <AuthLayout>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground">
            Reset link unavailable
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            {error ||
              "This password recovery link is invalid or has expired."}
          </p>

          <a
            href="/login"
            className="mt-6 inline-block text-sm font-bold text-foreground hover:underline"
          >
            Back to login
          </a>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-foreground">
            Password updated
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Your password has been successfully updated.
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            Redirecting you to admin login...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
          Set New Password
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
          Enter a new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            New password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your new password"
            autoComplete="new-password"
            disabled={updating}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground"
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Confirm new password
          </label>

          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm your new password"
            autoComplete="new-password"
            disabled={updating}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground"
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={updating}
          className="w-full rounded-lg bg-foreground px-4 py-3 text-sm font-bold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updating ? "Updating password..." : "Set New Password"}
        </button>
      </form>
    </AuthLayout>
  );
}