import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Chatpate Routes account" },
      {
        name: "description",
        content: "Continue with Google to join the Chatpate Routes community.",
      },
      { property: "og:title", content: "Create your Chatpate Routes account" },
      {
        property: "og:description",
        content: "Your account is created automatically when you sign in with Google.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <AuthLayout footer="New here? Your account will be created automatically.">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
          Welcome to Chatpate Routes
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
          Your next adventure starts here.
        </p>
      </div>
      <div className="mt-8">
        <GoogleSignInButton returnPath="/" />
      </div>
    </AuthLayout>
  );
}
