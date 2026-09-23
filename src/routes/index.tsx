import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import "@/styles/home.css";
import { BookingModal, type BookingDraft } from "@/components/home/BookingModal";
import { HomeNav } from "@/components/home/HomeNav";
import {
  HeroSection,
  WhySection,
  FounderSection,
  ArchivesSection,
  MeetupsSection,
  ItinerarySection,
  SiteFooter,
} from "@/components/home/HomeSections";
import { UpcomingTrips } from "@/components/home/UpcomingTrips";

type SearchTrip = {
  id: string;
  title: string;
  destination?: string | null;
  start_date?: string | null;
  end_date?: string | null;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chatpate Routes — Curated Group Trips & Travel Community" },
      {
        name: "description",
        content:
          "Curated journeys, interesting places and great people to travel with. Join Chatpate Routes group trips across the Himalayas, Rajasthan and beyond.",
      },
      { property: "og:title", content: "Chatpate Routes — Curated Group Trips" },
      {
        property: "og:description",
        content:
          "Boring travel is just not our vibe. Discover upcoming group trips, Delhi meetups and a travel community worth joining.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Nothing+You+Could+Do&family=Caveat:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);
  const closeBooking = useCallback(() => setBookingDraft(null), []);

  return (
<div className="home-page">
  <HomeNav />

  <main>
    <HeroSection
      onFindTrip={async (destination, travelDate, selectedTrip) => {
        if (!destination.trim() && travelDate) {
          navigate({
            to: "/trips",
            search: { month: "", date: travelDate, q: "" },
          });
          return;
        }

        try {
          const response = await fetch("/api/trips");

          if (!response.ok) {
            throw new Error("Failed to fetch trips");
          }

          const result = await response.json();

          if (!result.success || !Array.isArray(result.trips)) {
            throw new Error("Invalid trips response");
          }

          const allTrips = result.trips as SearchTrip[];

          const normalizedDestination = destination.trim().toLowerCase();

          // Find a trip where the destination matches
          // and the selected date falls within the trip dates.
          const selectedTripMatch = selectedTrip
            ? allTrips.find((trip) => {
                if (trip.id !== selectedTrip.id) return false;
                if (!travelDate) return true;

                const startDate = trip.start_date?.slice(0, 10) ?? "";
                const endDate = trip.end_date?.slice(0, 10) || startDate;
                return Boolean(
                  startDate &&
                    endDate &&
                    travelDate >= startDate &&
                    travelDate <= endDate,
                );
              })
            : null;

          const matchedTrip = selectedTripMatch || allTrips.find((trip) => {
            const tripDestination = (
              trip.destination || trip.title || ""
            ).trim().toLowerCase();

            const destinationMatches =
              tripDestination.includes(normalizedDestination) ||
              trip.title?.trim().toLowerCase().includes(normalizedDestination);

            const dateMatches =
              !travelDate ||
              Boolean(
                trip.start_date &&
                  travelDate >= trip.start_date.slice(0, 10) &&
                  travelDate <= (trip.end_date || trip.start_date).slice(0, 10),
              );

            return destinationMatches && dateMatches;
          }) || (!travelDate ? allTrips.find((trip) => {
            const tripDestination = (
              trip.destination || trip.title || ""
            ).trim().toLowerCase();

            return (
              tripDestination.includes(normalizedDestination) ||
              trip.title?.trim().toLowerCase().includes(normalizedDestination)
            );
          }) : null);

          if (matchedTrip) {
            navigate({
              to: "/trip-detail",
              search: {
                trip: matchedTrip.id,
              },
            });

            return;
          }

          if (travelDate) {
            navigate({
              to: "/trips",
              search: { month: "", date: travelDate, q: destination.trim() },
            });
            return;
          }

          // No exact destination + date match yet.
          // We will add the recommendation flow next.
          setBookingDraft({
            trip: destination,
            travelDate,
          });
        } catch (error) {
          console.error("Failed to find trip:", error);

          setBookingDraft({
            trip: destination,
            travelDate,
          });
        }
      }}
    />

    <UpcomingTrips />
    <WhySection />
    <FounderSection />
    <ArchivesSection />
    <MeetupsSection />
    <ItinerarySection />
  </main>
      <SiteFooter />
      {bookingDraft ? <BookingModal draft={bookingDraft} onClose={closeBooking} /> : null}
    </div>
  );
}
