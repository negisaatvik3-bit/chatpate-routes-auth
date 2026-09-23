import { createFileRoute } from "@tanstack/react-router";
import { AdminSignInPage } from "@/components/auth/AdminSignInPage";

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
  component: AdminSignInPage,
});
