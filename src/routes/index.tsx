import { createFileRoute } from "@tanstack/react-router";

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