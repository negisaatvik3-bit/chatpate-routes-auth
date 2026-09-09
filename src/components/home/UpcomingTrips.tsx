import { useState } from "react";
import { Link } from "@tanstack/react-router";

import birImage from "@/assets/bir-copy.png";
import jibhiImage from "@/assets/jibhi.png";
import rishikeshImage from "@/assets/rishikesh.png";
import jimImage from "@/assets/jim.png";
import udaipurImage from "@/assets/udaipur.png";

const trips = [
  {
    slug: "bir-barot-valley",
    image: birImage,
    date: "4 — 6 Sept",
    title: "Bir × Barot Valley 2.0",
    location: "Himachal Pradesh, India",
    duration: "3 Days",
    price: "₹8,999",
  },
  {
    slug: "ghiyagi-jibhi",
    image: jibhiImage,
    date: "18 — 20 Sept",
    title: "Ghiyagi × Jibhi",
    location: "Himachal Pradesh, India",
    duration: "3 Days",
    price: "₹8,999",
  },
  {
    slug: "rishikesh",
    image: rishikeshImage,
    date: "3 — 5 Oct",
    title: "Rishikesh",
    location: "Uttarakhand, India",
    duration: "3 Days",
    price: "₹7,999",
  },
  {
    slug: "jim-corbett",
    image: jimImage,
    date: "17 — 19 Oct",
    title: "Jim Corbett",
    location: "Uttarakhand, India",
    duration: "3 Days",
    price: "₹8,499",
  },
  {
    slug: "udaipur",
    image: udaipurImage,
    date: "31 Oct — 2 Nov",
    title: "Udaipur",
    location: "Rajasthan, India",
    duration: "3 Days",
    price: "₹9,499",
  },
];

export function UpcomingTrips() {
  const [current, setCurrent] = useState(0);

  const nextTrip = () => {
    setCurrent((value) => Math.min(value + 1, trips.length - 1));
  };

  const previousTrip = () => {
    setCurrent((value) => Math.max(value - 1, 0));
  };

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
            onClick={previousTrip}
            disabled={current === 0}
            aria-label="Previous trips"
          >
            ←
          </button>

          <button
            type="button"
            className="trip-arrow next"
            onClick={nextTrip}
            disabled={current === trips.length - 1}
            aria-label="Next trips"
          >
            →
          </button>
        </div>
      </div>

      <div className="trip-slider">
        <div
          className="trip-grid"
          style={{
            transform: `translateX(-${current * 33.333}%)`,
          }}
        >
          {trips.map((trip) => (
            <Link
              key={trip.title}
              to="/trip-detail"
              search={{ trip: trip.slug }}
              className="trip-card-link"
            >
              <article className="trip-card">
                <div className="trip-image">
                  <span className="trip-season">{trip.date}</span>

                  <img src={trip.image} alt={trip.title} />
                </div>

                <div className="trip-info">
                  <h3>{trip.title}</h3>

                  <div className="trip-location">
                    {trip.location}
                  </div>

                  <div className="trip-meta">
                    <div className="trip-meta-top">
                      <div className="meta-item">
                        <span>Duration</span>
                        <strong>{trip.duration}</strong>
                      </div>

                      <div className="meta-item route-item">
                        <span>Dates</span>
                        <strong>{trip.date}</strong>
                      </div>
                    </div>

                    <div className="trip-bottom">
                      <span className="view-details">
                        Explore →
                      </span>

                      <div className="trip-price">
                        <span>From</span>
                        <strong>{trip.price}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import birImage from "@/assets/bir-copy.png";
import jibhiImage from "@/assets/jibhi.png";
import rishikeshImage from "@/assets/rishikesh.png";
import jimImage from "@/assets/jim.png";
import udaipurImage from "@/assets/udaipur.png";

type BackendTrip = {
  id: string;
  title: string;
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

const fallbackDates: Record<string, string> = {
  "Bir × Barot Valley 2.0": "4 — 6 Sept",
  "Ghiyagi × Jibhi": "18 — 20 Sept",
  Rishikesh: "3 — 5 Oct",
  "Jim Corbett": "17 — 19 Oct",
  Udaipur: "31 Oct — 2 Nov",
};

function formatDateRange(
  startDate: string | null,
  endDate: string | null,
  title: string,
) {
  if (!startDate) {
    return fallbackDates[title] || "Date TBA";
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
  const [current, setCurrent] = useState(0);
  const [trips, setTrips] = useState<BackendTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const nextTrip = () => {
    setCurrent((value) =>
      Math.min(value + 1, Math.max(trips.length - 1, 0)),
    );
  };

  const previousTrip = () => {
    setCurrent((value) => Math.max(value - 1, 0));
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
            onClick={previousTrip}
            disabled={current === 0}
            aria-label="Previous trips"
          >
            ←
          </button>

          <button
            type="button"
            className="trip-arrow next"
            onClick={nextTrip}
            disabled={current >= trips.length - 1}
            aria-label="Next trips"
          >
            →
          </button>
        </div>
      </div>

      <div className="trip-slider">
        <div
          className="trip-grid"
          style={{
            transform: `translateX(-${current * 33.333}%)`,
          }}
        >
          {trips.map((trip) => {
            const title = trip.title;

            const image =
              trip.cover_image_url ||
              fallbackImages[title] ||
              birImage;

            const date = formatDateRange(
              trip.start_date,
              trip.end_date,
              title,
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
                search={{ trip: trip.id }}
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
      </div>
    </section>
  );
}
        </div>
      </div>
    </section>
  );
}