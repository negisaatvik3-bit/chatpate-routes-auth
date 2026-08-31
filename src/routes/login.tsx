import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
      <div className="mt-3 text-center">
        <button
          type="button"
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Forgot password?
        </button>
      </div>
    </AuthLayout>
  );
}
