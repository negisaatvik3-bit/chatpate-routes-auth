import { createFileRoute } from "@tanstack/react-router";
import { TripsPage } from "@/components/trips/TripsPage";

export const Route = createFileRoute("/trips")({
  component: TripsPage,
});
