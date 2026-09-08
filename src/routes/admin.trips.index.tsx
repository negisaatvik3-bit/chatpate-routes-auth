import { createFileRoute } from "@tanstack/react-router";
import AdminTripsPage from "@/components/admin/trips/AdminTripsPage";

export const Route = createFileRoute("/admin/trips/")({
  component: AdminTripsPage,
});