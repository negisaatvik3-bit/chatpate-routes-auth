import { createFileRoute } from "@tanstack/react-router";
import { TripDetailPage } from "@/components/trip-detail/TripDetailPage";

export const Route = createFileRoute("/trip-detail")({
  component: TripDetailPage,
});
