import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integerations/supabase/client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { LoginForm } from "@/components/auth/LoginForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in to Chatpate Routes" },
      {
        name: "description",
        content: "Log back in to Chatpate Routes and pick up planning your next group trip.",
      },
      { property: "og:title", content: "Log in to Chatpate Routes" },
      { property: "og:description", content: "Your next adventure is waiting." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [socialError, setSocialError] = useState<string | null>(null);

  return (
    <AuthLayout
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold text-foreground hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <div className="text-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
          Welcome back
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
          Your next adventure is waiting.
        </p>
        <div className="mt-6">
          <SocialAuthButtons onError={setSocialError} />
        </div>
        {socialError ? (
          <p role="alert" className="mt-2 text-xs text-destructive">
            {socialError}
          </p>
        ) : null}
        <AuthDivider />
      </div>
      <LoginForm />
      <div className="mt-4">
  <form
    onSubmit={async (event) => {
      event.preventDefault();

      setResetMessage(null);
      setResetError(null);

      if (!resetEmail.trim()) {
        setResetError("Please enter your email address.");
        return;
      }

      setResetting(true);

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(
          resetEmail.trim(),
          {
            redirectTo: `${window.location.origin}/reset-password`,
          },
        );

        if (error) {
          setResetError(error.message);
          return;
        }

        setResetMessage(
          "Password recovery email sent. Please check your inbox.",
        );
      } catch (error) {
        console.error("Password reset request error:", error);

        setResetError(
          "Unable to send the password recovery email. Please try again.",
        );
      } finally {
        setResetting(false);
      }
    }}
    className="space-y-3"
  >
    <input
      type="email"
      value={resetEmail}
      onChange={(event) => setResetEmail(event.target.value)}
      placeholder="Email for password reset"
      autoComplete="email"
      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground"
    />

    <button
      type="submit"
      disabled={resetting}
      className="w-full text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
    >
      {resetting ? "Sending..." : "Forgot password?"}
    </button>

    {resetMessage ? (
      <p className="text-xs text-green-600" role="status">
        {resetMessage}
      </p>
    ) : null}

    {resetError ? (
      <p className="text-xs text-destructive" role="alert">
        {resetError}
      </p>
    ) : null}
  </form>
</div>
    </AuthLayout>
  );
}
