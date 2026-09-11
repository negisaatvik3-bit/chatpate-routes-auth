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
import { TripsSection } from "@/components/home/TripsSection";

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
  <HomeNav onJoinTrip={() => setBookingDraft({})} />

  <main>
    <HeroSection
      onFindTrip={async (destination, travelDate) => {
        try {
          const response = await fetch("/api/trips");

          if (!response.ok) {
            throw new Error("Failed to fetch trips");
          }

          const result = await response.json();

          if (!result.success || !Array.isArray(result.trips)) {
            throw new Error("Invalid trips response");
          }

          const allTrips = result.trips;

          const normalizedDestination = destination.trim().toLowerCase();

          // Find a trip where the destination matches
          // and the selected date falls within the trip dates.
          const matchedTrip = allTrips.find((trip: any) => {
            const tripDestination = (
              trip.destination || trip.title || ""
            ).trim().toLowerCase();

            const destinationMatches =
              tripDestination === normalizedDestination ||
              trip.title?.trim().toLowerCase() === normalizedDestination;

            const dateMatches =
              !travelDate ||
              (
                travelDate >= trip.start_date &&
                travelDate <= trip.end_date
              );

            return destinationMatches && dateMatches;
          });

          if (matchedTrip) {
            navigate({
              to: "/trip-detail",
              search: {
                trip: matchedTrip.id,
              },
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

    <TripsSection
      onSelectTrip={(trip) =>
        navigate({
          to: "/trip-detail",
          search: {
            trip: trip.slug,
          },
        })
      }
    />
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