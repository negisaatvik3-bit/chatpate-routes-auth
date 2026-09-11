import { createFileRoute } from "@tanstack/react-router";
import MyBookings from "@/components/mybookings/MyBookings";

export const Route = createFileRoute("/my-bookings")({
  component: MyBookings,
});