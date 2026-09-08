import { createFileRoute } from "@tanstack/react-router";
import MyBookings from "../components/mybookings/MyBookings";

export const Route = createFileRoute("/dashboard/bookings")({
  component: MyBookings,
});