import { createFileRoute } from "@tanstack/react-router";

import "@/styles/home.css";
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
  return (
    <div className="home-page">
      <HomeNav />

      <main>
        <HeroSection />
        <TripsSection />
        <WhySection />
        <FounderSection />
        <ArchivesSection />
        <MeetupsSection />
        <ItinerarySection />
      </main>

      <SiteFooter />
    </div>
  );
}