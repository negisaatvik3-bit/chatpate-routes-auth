import { createFileRoute } from "@tanstack/react-router";
import { BookingPage } from "@/components/booking/BookingPage";

export const Route = createFileRoute("/booking")({
  component: BookingPage,
});
