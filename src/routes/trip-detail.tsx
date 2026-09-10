import { createFileRoute } from "@tanstack/react-router";

import { TripDetailPage } from "@/components/trip-detail/TripDetailPage";

export const Route = createFileRoute("/trip-detail")({
  validateSearch: (search: Record<string, unknown>) => ({
    trip: typeof search.trip === "string" ? search.trip : "",
  }),
  component: TripDetailPage,
});