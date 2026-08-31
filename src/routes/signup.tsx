import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { SignupForm } from "@/components/auth/SignupForm";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Chatpate Routes account" },
      {
        name: "description",
        content:
          "Join the Chatpate Routes travel community and discover curated group trips worth travelling for.",
      },
      { property: "og:title", content: "Create your Chatpate Routes account" },
      {
        property: "og:description",
        content: "Join a travel community built around curated group trips.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [socialError, setSocialError] = useState<string | null>(null);

  return (
    <AuthLayout
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-foreground hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <div className="text-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
          Start your next
          <br />
          adventure
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
          Join the Chatpate Routes community and discover experiences worth travelling for.
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
      <SignupForm />
    </AuthLayout>
  );
}
