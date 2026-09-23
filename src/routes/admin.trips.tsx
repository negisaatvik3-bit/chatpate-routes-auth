import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";

export const Route = createFileRoute("/admin/trips")({
  component: AdminTripsLayout,
});

function AdminTripsLayout() {
  return (
    <>
      <Navbar activePage="trips" variant="light" />
      <Outlet />
    </>
  );
}
