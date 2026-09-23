import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Chatpate Routes" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <Outlet />,
});
