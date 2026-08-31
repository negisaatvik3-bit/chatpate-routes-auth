import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Chatpate Routes" },
      {
        name: "description",
        content: "Secure administrator sign-in for the Chatpate Routes platform.",
      },
      { property: "og:title", content: "Admin Portal — Chatpate Routes" },
      {
        property: "og:description",
        content: "Secure administrator sign-in for the Chatpate Routes platform.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  return (
    <AuthLayout
      brandSuffix="Admin Portal"
      place="Operations Hub"
      region="Chatpate Routes"
      distance="24 trips"
      distanceNote="running this season"
      trail="Internal access"
      footer={
        <span className="text-xs text-muted-foreground">
          Access is granted by the Chatpate Routes team.
        </span>
      }
    >
      <div className="text-center">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground">
          Welcome back, Admin
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
          Sign in with your administrator credentials to manage trips and members.
        </p>
      </div>
      <div className="mt-6">
        <LoginForm variant="admin" />
      </div>
    </AuthLayout>
  );
}
