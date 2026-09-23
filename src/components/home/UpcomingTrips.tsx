import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import birImage from "@/assets/bir-copy.png";
import jibhiImage from "@/assets/jibhi.png";
import rishikeshImage from "@/assets/rishikesh.png";
import jimImage from "@/assets/jim.png";
import udaipurImage from "@/assets/udaipur.png";
import { useCurrentTripDate } from "@/hooks/use-current-trip-date";
import { isUpcomingTrip } from "@/lib/trip-dates";

type BackendTrip = {
  id: string;
  title: string;
  slug: string;
  destination: string | null;
  duration_days: number | null;
  price: number | null;
  start_date: string | null;
  end_date: string | null;
  cover_image_url: string | null;
  status: "draft" | "published" | "archived";
};

const fallbackImages: Record<string, string> = {
  "Bir × Barot Valley 2.0": birImage,
  "Ghiyagi × Jibhi": jibhiImage,
  Rishikesh: rishikeshImage,
  "Jim Corbett": jimImage,
  Udaipur: udaipurImage,
};

function formatDateRange(
  startDate: string | null,
  endDate: string | null,
) {
  if (!startDate) {
    return "Date TBA";
  }

  const start = new Date(startDate);

  const startText = start.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  if (!endDate) {
    return startText;
  }

  const end = new Date(endDate);

  const endText = end.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return `${startText} — ${endText}`;
}

function formatPrice(price: number | null, title: string) {
  if (price == null) {
    return title === "Bir × Barot Valley 2.0"
      ? "₹8,999"
      : "Price on request";
  }

  return `₹${price.toLocaleString("en-IN")}`;
}

export function UpcomingTrips() {
  const today = useCurrentTripDate();
  const [trips, setTrips] = useState<BackendTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const upcomingTrips = useMemo(
    () =>
      trips.filter((trip) =>
        isUpcomingTrip(trip.start_date, trip.end_date, today),
      ),
    [today, trips],
  );

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const response = await fetch("/api/trips");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load trips.");
        }

        setTrips(result.trips || []);
      } catch (error) {
        console.error("Failed to load homepage trips:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrips();
  }, []);

  const updateScrollState = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    setCanScrollPrevious(slider.scrollLeft > 4);
    setCanScrollNext(
      slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    updateScrollState();
    slider.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      slider.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [isLoading, upcomingTrips, updateScrollState]);

  const scrollByCard = (direction: 1 | -1) => {
    const slider = sliderRef.current;
    const track = slider?.querySelector<HTMLElement>(".trip-grid");
    const card = slider?.querySelector<HTMLElement>(".trip-card-link");

    if (!slider || !track || !card) return;

    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;

    slider.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <section className="trips" id="trips">
        <div className="section-top">
          <div>
            <div className="eyebrow">
              Find your next route with,
            </div>

            <h2>Our Upcoming Trips</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="trips" id="trips">
      <div className="section-top">
        <div>
          <div className="eyebrow">
            Find your next route with,
          </div>

          <h2>Our Upcoming Trips</h2>
        </div>

        <div className="trip-arrows">
          <button
            type="button"
            className="trip-arrow prev"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrevious}
            aria-label="Previous trips"
          >
            ←
          </button>

          <button
            type="button"
            className="trip-arrow next"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            aria-label="Next trips"
          >
            →
          </button>
        </div>
      </div>

      <div className="trip-slider" ref={sliderRef}>
        <div className="trip-grid">
          {upcomingTrips.map((trip) => {
            const title = trip.title;

            const image =
              trip.cover_image_url ||
              fallbackImages[title] ||
              birImage;

            const date = formatDateRange(
              trip.start_date,
              trip.end_date,
            );

            const duration = trip.duration_days
              ? `${trip.duration_days} Days`
              : "Duration TBA";

            const price = formatPrice(
              trip.price,
              title,
            );

            return (
              <Link
                key={trip.id}
                to="/trip-detail"
                search={{ trip: trip.slug }}
                className="trip-card-link"
              >
                <article className="trip-card">
                  <div className="trip-image">
                    <span className="trip-season">
                      {date}
                    </span>

                    <img
                      src={image}
                      alt={title}
                    />
                  </div>

                  <div className="trip-info">
                    <h3>{title}</h3>

                    <div className="trip-location">
                      {trip.destination || "India"}
                    </div>

                    <div className="trip-meta">
                      <div className="trip-meta-top">
                        <div className="meta-item">
                          <span>Duration</span>
                          <strong>{duration}</strong>
                        </div>

                        <div className="meta-item route-item">
                          <span>Dates</span>
                          <strong>{date}</strong>
                        </div>
                      </div>

                      <div className="trip-bottom">
                        <span className="view-details">
                          Explore →
                        </span>

                        <div className="trip-price">
                          <span>From</span>
                          <strong>{price}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
        {upcomingTrips.length === 0 ? (
          <p className="trip-slider-empty">
            No upcoming trips right now. Check back soon.
          </p>
        ) : null}
      </div>
    </section>

  );
}
