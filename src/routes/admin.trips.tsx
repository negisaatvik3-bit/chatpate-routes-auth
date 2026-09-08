import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/trips")({
  component: AdminTripsLayout,
});

function AdminTripsLayout() {
  return <Outlet />;
}