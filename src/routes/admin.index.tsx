import { createFileRoute } from "@tanstack/react-router";
import { AdminSignInPage } from "@/components/auth/AdminSignInPage";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Chatpate Routes" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSignInPage,
});
