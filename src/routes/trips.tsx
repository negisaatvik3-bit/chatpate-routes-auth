import { createFileRoute } from "@tanstack/react-router";
import { TripsPage } from "@/components/trips/TripsPage";

export const Route = createFileRoute("/trips")({
  validateSearch: (search: Record<string, unknown>) => ({
    month:
      typeof search["month"] === "string"
        ? search["month"]
        : "",
    date:
      typeof search["date"] === "string"
        ? search["date"]
        : "",
    q:
      typeof search["q"] === "string"
        ? search["q"]
        : "",
  }),
  component: TripsPage,
});
