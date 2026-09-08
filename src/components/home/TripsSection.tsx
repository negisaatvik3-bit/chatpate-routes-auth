import { useCallback, useEffect, useRef, useState } from "react";
import { trips, type Trip } from "./tripData";

function cardsPerView(width: number) {
  if (width <= 650) return 1;
  if (width <= 900) return 2;
  return 3;
}

export function TripsSection({ onSelectTrip }: { onSelectTrip: (trip: Trip) => void }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const update = useCallback((nextPage: number) => {
    const grid = gridRef.current;
    if (!grid) return;
    const perView = cardsPerView(window.innerWidth);
    const pages = Math.max(0, Math.ceil(trips.length / perView) - 1);
    const card = grid.querySelector(".trip-card");
    const width = card ? card.getBoundingClientRect().width : 0;
    const styles = window.getComputedStyle(grid);
    const gap = parseFloat(styles.columnGap) || parseFloat(styles.gap) || 0;
    const clamped = Math.min(Math.max(nextPage, 0), pages);

    setTotalPages(pages);
    setPage(clamped);
    setOffset(clamped * perView * (width + gap));
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => update(0));
    const onResize = () => update(page);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  return (
    <section className="trips" id="trips">
      <div className="section-top">
        <div>
          <div className="eyebrow">Find your next route with,</div>
          <h2>Our Upcoming Trips</h2>
        </div>

        <div className="trip-arrows">
          <button
            type="button"
            className="trip-arrow prev"
            aria-label="Previous trips"
            disabled={page === 0}
            onClick={() => update(page - 1)}
          >
            ←
          </button>
          <button
            type="button"
            className="trip-arrow next"
            aria-label="Next trips"
            disabled={page >= totalPages}
            onClick={() => update(page + 1)}
          >
            →
          </button>
        </div>
      </div>

      <div className="trip-slider">
        <div className="trip-grid" ref={gridRef} style={{ transform: `translateX(-${offset}px)` }}>
          {trips.map((trip) => (
            <article className="trip-card" key={trip.title}>
              <div className="trip-image">
                <span className="trip-season">{trip.dates}</span>
                <img src={trip.image} alt={trip.alt} loading="lazy" />
              </div>

              <div className="trip-info">
                <h3>{trip.title}</h3>
                <div className="trip-location">{trip.location}</div>

                <div className="trip-meta">
                  <div className="trip-meta-top">
                    <div className="meta-item">
                      <span>Duration</span>
                      <strong>{trip.duration}</strong>
                    </div>
                    <div className="meta-item route-item">
                      <span>Dates</span>
                      <strong>{trip.dates}</strong>
                    </div>
                  </div>

                  <div className="trip-bottom">
                    <a
                      href={trip.title === "Bir × Barot Valley 2.0" ? "/trip-detail" : "#trips"}
                      className="view-details"
                      onClick={(e) => {
                        if (trip.title !== "Bir × Barot Valley 2.0") {
                          e.preventDefault();
                          onSelectTrip(trip);
                        }
                      }}
                    >
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
