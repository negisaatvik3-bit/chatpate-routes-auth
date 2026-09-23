import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { supabase } from "@/integerations/supabase/client";
import { getSafeRedirectPath } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in to Chatpate Routes" },
      {
        name: "description",
        content: "Log in to Chatpate Routes with your Google account.",
      },
      { property: "og:title", content: "Log in to Chatpate Routes" },
      { property: "og:description", content: "Your next adventure is waiting." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [returnPath] = useState(() => {
    if (typeof window === "undefined") return "/";

    return getSafeRedirectPath(
      new URLSearchParams(window.location.search).get("redirect"),
      "/",
    );
  });
  const redirected = useRef(false);

  useEffect(() => {
    let active = true;

    const continueToDestination = (session: unknown) => {
      if (!active || !session || redirected.current) return;

      redirected.current = true;
      window.location.replace(returnPath);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      continueToDestination(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => continueToDestination(session),
    );

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [returnPath]);

  return (
    <AuthLayout
      footer="New here? Your account will be created automatically."
    >
      <div className="text-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
          Welcome to Chatpate Routes
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
          Your next adventure starts here.
        </p>
      </div>

      <div className="mt-8">
        <GoogleSignInButton returnPath={returnPath} />
      </div>
    </AuthLayout>
  );
}
