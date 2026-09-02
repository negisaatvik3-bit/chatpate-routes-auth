import { useEffect, useMemo, useRef, useState } from "react";
import birCopy from "@/assets/bir-copy.png";
import jibhi from "@/assets/jibhi.png";
import rishikesh from "@/assets/rishikesh.png";
import jim from "@/assets/jim.png";
import udaipur from "@/assets/udaipur.png";
import communityImage from "@/assets/03.jpg";
import { TripsNav } from "./TripsNav";
import "./trips.css";

type Filter = "all" | "upcoming" | "weekend" | "backpacking" | "popular";
type Month = "all" | "september" | "october" | "november" | "december";

type Trip = {
  name: string;
  location: string;
  dates: string;
  duration: string;
  price: string;
  season: string;
  month: Month;
  availability: string;
  image: string;
  alt: string;
  categories: string[];
  search: string;
  href: string;
};

const trips: Trip[] = [
  {
    name: "Bir × Barot Valley 2.0",
    location: "Himachal Pradesh, India",
    dates: "4–6 Sept",
    duration: "3 Days",
    price: "₹8,999",
    season: "SEPTEMBER",
    month: "september",
    availability: "10 SPOTS LEFT",
    image: birCopy,
    alt: "Bir and Barot Valley",
    categories: ["upcoming", "weekend", "himachal", "backpacking"],
    search: "bir barot valley himachal backpacking",
    href: "/trip-detail",
  },
  {
    name: "Ghiyagi × Jibhi",
    location: "Himachal Pradesh, India",
    dates: "18–20 Sept",
    duration: "3 Days",
    price: "₹7,499",
    season: "SEPTEMBER",
    month: "september",
    availability: "8 SPOTS LEFT",
    image: jibhi,
    alt: "Ghiyagi and Jibhi",
    categories: ["upcoming", "retreat", "himachal"],
    search: "ghiyagi jibhi himachal retreat",
    href: "/trips/ghiyagi-jibhi",
  },
  {
    name: "Rishikesh",
    location: "Uttarakhand, India",
    dates: "27–28 Sept",
    duration: "2 Days",
    price: "₹5,999",
    season: "SEPTEMBER",
    month: "september",
    availability: "10 SPOTS LEFT",
    image: rishikesh,
    alt: "Rishikesh",
    categories: ["upcoming", "weekend", "backpacking"],
    search: "rishikesh uttarakhand backpacking weekend",
    href: "/trips/rishikesh",
  },
  {
    name: "Jim Corbett",
    location: "Uttarakhand, India",
    dates: "11–13 Oct",
    duration: "3 Days",
    price: "₹8,599",
    season: "OCTOBER",
    month: "october",
    availability: "10 SPOTS LEFT",
    image: jim,
    alt: "Jim Corbett",
    categories: ["upcoming", "weekend"],
    search: "jim corbett uttarakhand weekend",
    href: "/trips/jim-corbett",
  },
  {
    name: "Udaipur",
    location: "Rajasthan, India",
    dates: "30 Oct–1 Nov",
    duration: "3 Days",
    price: "₹9,499",
    season: "OCTOBER",
    month: "october",
    availability: "3 SPOTS LEFT",
    image: udaipur,
    alt: "Udaipur",
    categories: ["upcoming", "weekend"],
    search: "udaipur rajasthan weekend",
    href: "/trips/udaipur",
  },
];

const filterOptions: { value: Filter; label: string }[] = [
  { value: "all", label: "All Trips" },
  { value: "upcoming", label: "Upcoming" },
  { value: "weekend", label: "Weekend" },
  { value: "backpacking", label: "Backpacking" },
  { value: "popular", label: "Popular" },
];

const monthOptions: { value: Month; label: string }[] = [
  { value: "all", label: "All Months" },
  { value: "september", label: "September 2026" },
  { value: "october", label: "October 2026" },
  { value: "november", label: "November 2026" },
  { value: "december", label: "December 2026" },
];

function TripCard({ trip, index }: { trip: Trip; index: number }) {
  return (
    <article className="trips-trip-card trips-reveal-visible" style={{ transitionDelay: `${index * 60}ms` }}>
      <a href={trip.href} className="trips-trip-link">
        <div className="trips-trip-image">
          <img src={trip.image} alt={trip.alt} />
          <div className="trips-trip-season">{trip.season}</div>
          <div className="trips-trip-availability">{trip.availability}</div>
        </div>
        <div className="trips-trip-info">
          <h3>{trip.name}</h3>
          <div className="trips-trip-location">{trip.location}</div>
          <div className="trips-trip-meta">
            <div className="trips-trip-meta-top">
              <div className="trips-meta-item">
                <span>Dates</span>
                <strong>{trip.dates}</strong>
              </div>
              <div className="trips-meta-item trips-route-item">
                <span>Duration</span>
                <strong>{trip.duration}</strong>
              </div>
            </div>
            <div className="trips-trip-bottom">
              <span className="trips-view-details">Explore Trip</span>
              <div className="trips-trip-price">
                <span>Starting from</span>
                <strong>{trip.price}</strong>
              </div>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}

export function TripsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [month, setMonth] = useState<Month>("all");
  const [monthOpen, setMonthOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setMonthOpen(false);
      }
    };
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

  const visibleTrips = useMemo(() => {
    const term = search.toLowerCase().trim();
    return trips.filter((trip) => {
      const matchesFilter = filter === "all" || trip.categories.includes(filter);
      const matchesMonth = month === "all" || trip.month === month;
      const matchesSearch = trip.search.toLowerCase().includes(term);
      return matchesFilter && matchesMonth && matchesSearch;
    });
  }, [search, filter, month]);

  const clearFilters = () => {
    setSearch("");
    setFilter("all");
    setMonth("all");
    setMonthOpen(false);
  };

  const selectedMonthLabel = monthOptions.find((option) => option.value === month)?.label ?? "All Months";

  return (
    <div className="trips-page">
      <TripsNav />

      <section className="trips-hero">
        <div className="trips-hero-inner trips-reveal-visible">
          <div className="trips-hero-eyebrow">Curated escapes · Real experiences</div>
          <h1>Find your next escape.</h1>
          <p>
            Offbeat places, unexpected stories and good people. Pick a trip and come make some memories with us.
          </p>
        </div>
      </section>

      <main className="trips-main">
        <div className="trips-container">
          <div className="trips-search-wrapper">
            <span className="trips-search-icon">⌕</span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search destinations or trips..."
              autoComplete="off"
              aria-label="Search destinations or trips"
            />
          </div>

          <div className="trips-filters">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`trips-filter-btn${filter === option.value ? " active" : ""}`}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}

            <div className={`trips-month-picker${monthOpen ? " open" : ""}`} ref={monthRef}>
              <button
                type="button"
                className="trips-month-picker-btn"
                aria-expanded={monthOpen}
                onClick={(event) => {
                  event.stopPropagation();
                  setMonthOpen((open) => !open);
                }}
              >
                <span className="trips-month-picker-icon">◷</span>
                <span>{selectedMonthLabel}</span>
                <span className="trips-month-picker-arrow">↓</span>
              </button>

              <div className="trips-month-dropdown">
                <div className="trips-month-dropdown-title">Travel month</div>
                {monthOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`trips-month-option${month === option.value ? " active" : ""}`}
                    onClick={() => {
                      setMonth(option.value);
                      setMonthOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="trips-trip-grid">
            {visibleTrips.map((trip, index) => (
              <TripCard key={trip.name} trip={trip} index={index} />
            ))}
          </div>

          {visibleTrips.length === 0 && (
            <div className="trips-empty-state">
              <h3>No trips found.</h3>
              <p>Try another destination or clear your filters.</p>
              <button type="button" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}

          <section
            className="trips-community-cta"
            style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.72), rgba(0,0,0,.2)), url(${communityImage})` }}
          >
            <div className="trips-community-content">
              <div className="trips-community-label">More than a trip</div>
              <h2>Come for the place. Stay for the people.</h2>
              <p>
                Chatpate Routes is built around people who want to explore somewhere different, meet strangers, and come back with stories worth telling.
              </p>
              <a className="trips-whatsapp-btn" href="https://wa.me/919266770149" target="_blank" rel="noopener noreferrer">
                Talk on WhatsApp →
              </a>
            </div>
          </section>
        </div>
      </main>

      <footer className="trips-site-footer">
        <div className="trips-footer-inner">
          <div className="trips-footer-brand">
            <h2>Chatpate<br />Routes.</h2>
            <p>Boring Travel is<br />just not our vibe.</p>
          </div>
          <div className="trips-footer-links">
            <div className="trips-footer-link-group">
              <span>Explore</span>
              <a href="/trips">Trips</a>
              <a href="/community">Community</a>
              <a href="/#meetups">Meetups</a>
              <a href="/about">About</a>
            </div>
            <div className="trips-footer-link-group">
              <span>Connect</span>
              <a href="https://www.instagram.com/chatpate.routes.in/?hl=en" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://wa.me/919266770149" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
            <div className="trips-footer-link-group">
              <span>Legal</span>
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms">Terms &amp; Conditions</a>
              <a href="/returns-refunds">Returns &amp; Refunds</a>
            </div>
          </div>
        </div>
        <div className="trips-footer-bottom">
          <span>© 2026 Chatpate Routes</span>
          <span>Made with ❤️ by <a href="https://techlearnsolutions.com/" target="_blank" rel="noopener noreferrer">TechLearn Solutions</a></span>
        </div>
      </footer>
    </div>
  );
}
