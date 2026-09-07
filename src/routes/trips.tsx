import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";

import "@/styles/home.css";
import { BookingModal, type BookingDraft } from "@/components/home/BookingModal";
import { HomeNav } from "@/components/home/HomeNav";
import { SiteFooter } from "@/components/home/HomeSections";
import { TripsSection } from "@/components/home/TripsSection";
import { homeImages } from "@/components/home/images";

export const Route = createFileRoute("/trips")({
  head: () => ({
    meta: [
      { title: "Trips — Chatpate Routes" },
      {
        name: "description",
        content:
          "Browse upcoming Chatpate Routes group trips across the Himalayas, Rajasthan and beyond.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Nothing+You+Could+Do&family=Caveat:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: TripsPage,
});

function TripsPage() {
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);
  const closeBooking = useCallback(() => setBookingDraft(null), []);

  return (
    <div className="cr-home trips-page">
      <HomeNav onJoinTrip={() => setBookingDraft({})} />

      <header className="trips-page-hero" style={{ backgroundImage: `url(${homeImages.hero})` }}>
        <div className="trips-page-hero-content">
          <p className="trips-page-eyebrow">CURATED ESCAPES · REAL EXPERIENCES</p>
          <h1>Find your next escape.</h1>
          <p>
            Offbeat places, unexpected stories and good people. Pick a trip and come make some
            memories with us.
          </p>
        </div>
      </header>

      <main className="trips-page-main">
        <TripsSection onSelectTrip={(trip) => setBookingDraft({ trip: trip.title })} />
      </main>

      <SiteFooter />
      {bookingDraft ? <BookingModal draft={bookingDraft} onClose={closeBooking} /> : null}
    </div>
  );
}
