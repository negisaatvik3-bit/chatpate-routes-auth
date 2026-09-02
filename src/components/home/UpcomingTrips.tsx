import { useState } from "react";

import birImage from "@/assets/bir-copy.png";
import jibhiImage from "@/assets/jibhi.png";
import rishikeshImage from "@/assets/rishikesh.png";
import jimImage from "@/assets/jim.png";
import udaipurImage from "@/assets/udaipur.png";

const trips = [
  {
    image: birImage,
    date: "4 — 6 Sept",
    title: "Bir × Barot Valley 2.0",
    location: "Himachal Pradesh, India",
    duration: "3 Days",
    price: "₹8,999",
  },
  {
    image: jibhiImage,
    date: "18 — 20 Sept",
    title: "Ghiyagi × Jibhi",
    location: "Himachal Pradesh, India",
    duration: "3 Days",
    price: "₹8,999",
  },
  {
    image: rishikeshImage,
    date: "3 — 5 Oct",
    title: "Rishikesh",
    location: "Uttarakhand, India",
    duration: "3 Days",
    price: "₹7,999",
  },
  {
    image: jimImage,
    date: "17 — 19 Oct",
    title: "Jim Corbett",
    location: "Uttarakhand, India",
    duration: "3 Days",
    price: "₹8,499",
  },
  {
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
            <article className="trip-card" key={trip.title}>
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
                    <a href="#" className="view-details">
                      Explore
                    </a>

                    <div className="trip-price">
                      <span>From</span>
                      <strong>{trip.price}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}