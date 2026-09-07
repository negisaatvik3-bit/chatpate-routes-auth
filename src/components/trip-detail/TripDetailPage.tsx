import { useEffect, useState } from "react";
import "./trip-detail.css";

const whatsappUrl =
  "https://wa.me/919266770149?text=Hi%20Chatpate%20Routes%2C%20I%27m%20interested%20in%20Bir%20%C3%97%20Barot%20Valley%202.0.";

const faqs = [
  {
    q: "Can I join the trip alone?",
    a: "Absolutely. Many people join Chatpate Routes without knowing anyone beforehand. That's part of the experience.",
  },
  {
    q: "Is this trip suitable for beginners?",
    a: "Yes. The trip is designed as a social travel experience and does not require advanced trekking experience.",
  },
  {
    q: "What happens after I book?",
    a: "You'll receive your booking confirmation and the next steps from the Chatpate Routes team.",
  },
  {
    q: "Can the itinerary change?",
    a: "Minor changes may happen because of weather, road conditions or local circumstances. The team will communicate important changes to travellers.",
  },
];

const sections = [
  ["overview", "Overview"],
  ["itinerary", "Itinerary"],
  ["stay", "Stay"],
  ["included", "Included"],
  ["packing", "What to Bring"],
  ["rules", "Rules"],
  ["faq", "FAQ"],
];

export function TripDetailPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("trip-detail-menu-open", menuOpen);
    return () => document.body.classList.remove("trip-detail-menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );

    sections.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll<HTMLElement>(
      ".trip-detail-page .reveal"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="trip-detail-page">
      <div className="trip-detail-mobile-booking-bar">
        <div className="trip-mobile-booking-info">
          <div className="trip-detail-mobile-booking-name">Bir × Barot Valley 2.0</div>
          <div className="trip-detail-mobile-booking-price">
            From <strong>₹8,999</strong> / person
          </div>
        </div>
        <a className="trip-mobile-book-btn" href="/booking?trip=bir-barot-valley">
          Book Now →
        </a>
      </div>

      <nav className="trip-detail-navbar">
        <div className="trip-detail-nav-brand">Chatpate Routes</div>

        <ul className="trip-detail-nav-links">
          <li><a href="/trips">Trips</a></li>
          <li><a href="/community">Community</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>

        <button
          className="trip-detail-hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`trip-detail-mobile-menu ${menuOpen ? "active" : ""}`}>
        <div className="trip-detail-mobile-menu-top">
          <div className="trip-detail-mobile-menu-brand">Chatpate Routes</div>
          <button
            className="trip-detail-menu-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <span />
            <span />
          </button>
        </div>

        <div className="trip-detail-mobile-menu-links">
          <a href="/trips" onClick={() => setMenuOpen(false)}>
            <span>01</span> Trips
          </a>
          <a href="/community" onClick={() => setMenuOpen(false)}>
            <span>02</span> Community
          </a>
          <a href="/about" onClick={() => setMenuOpen(false)}>
            <span>03</span> About
          </a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>
            <span>04</span> Contact
          </a>
        </div>
      </div>

      <section className="trip-detail-hero">
        <div className="trip-detail-hero-inner reveal">
          <div className="trip-detail-hero-label">
            Himachal Pradesh · September 2026
          </div>
          <h1 className="trip-detail-hero-title">
            Bir × Barot
            <br />
            Valley 2.0
          </h1>
          <p className="trip-detail-hero-subtitle">
            Three days of mountain roads, quiet villages, local food and the
            kind of people who make a short trip feel much longer.
          </p>
          <div className="trip-detail-hero-meta">
            <span>4–6 September 2026</span>
            <span className="trip-detail-hero-dot" />
            <span>3 Days · 2 Nights</span>
            <span className="trip-detail-hero-dot" />
            <span>10 spots left</span>
          </div>
        </div>
      </section>

      <main className="trip-detail-main">
        <div className="trip-detail-layout">
          <div className="trip-detail-content">
            <nav className="trip-detail-section-nav">
              {sections.map(([id, label]) => (
                <button
                  key={id}
                  className={activeSection === id ? "active" : ""}
                  onClick={() => scrollToSection(id)}
                >
                  {label}
                </button>
              ))}
            </nav>

            <section className="trip-detail-section reveal" id="overview">
              <div className="trip-detail-section-kicker">The Route</div>
              <h2 className="trip-detail-section-title">
                Not another Himachal checklist.
              </h2>
              <p className="trip-detail-section-text">
                Bir × Barot is built for people who want to experience Himachal
                beyond the usual tourist circuit. Over three days, we'll move
                between mountain villages, forests and quiet valley roads, with
                enough time to actually enjoy where we are.
              </p>

              <div className="trip-detail-highlight-grid">
                {[
                  ["01", "Offbeat Places", "Explore quieter corners of the valley instead of rushing between tourist spots."],
                  ["02", "Local Experiences", "Chai, local food, village walks and conversations along the way."],
                  ["03", "Small Group", "Travel with a small group of people rather than a crowded tour bus."],
                  ["04", "Real Experiences", "Come back with stories instead of another folder full of tourist photos."],
                ].map(([num, title, text]) => (
                  <div className="trip-detail-highlight" key={num}>
                    <div className="trip-detail-highlight-number">{num}</div>
                    <h4>{title}</h4>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="trip-detail-section reveal" id="itinerary">
              <div className="trip-detail-section-kicker">The Plan</div>
              <h2 className="trip-detail-section-title">
                Three days. One good story.
              </h2>

              <div className="trip-detail-itinerary">
                {[
                  ["DAY 01", "Delhi → Bir", "Meet the group, begin the journey towards Bir and settle into the mountains. We'll spend the evening exploring the village, grabbing local food and getting to know the people we're travelling with."],
                  ["DAY 02", "Bir → Barot Valley", "Head deeper into the valley through mountain roads and smaller villages. Spend the day around Barot, explore the surroundings and slow things down."],
                  ["DAY 03", "Barot → Delhi", "Enjoy a relaxed morning before beginning the journey back. Expect conversations, music, chai stops and one last look at the mountains before heading home."],
                ].map(([day, title, text]) => (
                  <div className="trip-detail-itinerary-day" key={day}>
                    <div className="trip-detail-day-number">{day}</div>
                    <div className="trip-detail-day-content">
                      <h4>{title}</h4>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="trip-detail-section reveal" id="stay">
              <div className="trip-detail-section-kicker">Good to know</div>
              <h2 className="trip-detail-section-title">The details.</h2>
              <div className="trip-detail-info-list">
                {[
                  ["Duration", "3 Days · 2 Nights"],
                  ["Destination", "Bir & Barot Valley, Himachal Pradesh"],
                  ["Group Size", "Small group experience"],
                  ["Accommodation", "Comfortable stay in curated local accommodation."],
                  ["Pickup", "Meeting point and exact pickup details will be shared with confirmed travellers."],
                  ["Trip Host", "Chatpate Routes trip host."],
                ].map(([label, value]) => (
                  <div className="trip-detail-info-row" key={label}>
                    <div className="trip-detail-info-label">{label}</div>
                    <div className="trip-detail-info-value">{value}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="trip-detail-section reveal" id="included">
              <div className="trip-detail-section-kicker">What's covered</div>
              <h2 className="trip-detail-section-title">
                Know what you're paying for.
              </h2>
              <div className="trip-detail-include-grid">
                <div>
                  <h4>Included</h4>
                  <ul className="trip-detail-include-list included">
                    <li>Accommodation for 2 nights</li>
                    <li>Planned trip transportation</li>
                    <li>Trip host / coordinator</li>
                    <li>Experiences mentioned in itinerary</li>
                    <li>Basic trip coordination</li>
                  </ul>
                </div>
                <div>
                  <h4>Not Included</h4>
                  <ul className="trip-detail-include-list excluded">
                    <li>Personal expenses</li>
                    <li>Alcohol and recreational expenses</li>
                    <li>Meals not mentioned in the itinerary</li>
                    <li>Personal shopping</li>
                    <li>Anything not specifically listed above</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="trip-detail-section reveal" id="packing">
              <div className="trip-detail-section-kicker">Pack smart</div>
              <h2 className="trip-detail-section-title">What to bring.</h2>
              <p className="trip-detail-section-text">
                Keep your luggage practical. You'll be moving around and
                spending time outdoors, so comfort matters more than packing
                everything you own.
              </p>
              <div className="trip-detail-packing-grid">
                {[
                  "Comfortable shoes",
                  "Light jacket",
                  "Weather-appropriate clothes",
                  "Personal medicines",
                  "Power bank",
                  "Water bottle",
                  "Sunscreen",
                  "Small backpack",
                  "Valid ID",
                ].map((item) => (
                  <div className="trip-detail-packing-item" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="trip-detail-section reveal" id="rules">
              <div className="trip-detail-section-kicker">Before you join</div>
              <h2 className="trip-detail-section-title">A few ground rules.</h2>
              <div className="trip-detail-rules">
                <ul>
                  <li>Be respectful towards fellow travellers, hosts and local communities.</li>
                  <li>Please be punctual for planned departures and activities.</li>
                  <li>Follow the instructions of the trip host during the journey.</li>
                  <li>Keep the destination clean and avoid unnecessary waste.</li>
                  <li>The itinerary may change slightly depending on weather, road conditions or local factors.</li>
                  <li>Read the cancellation and refund policy before completing your booking.</li>
                </ul>
              </div>
            </section>

            <section className="trip-detail-section reveal" id="faq">
              <div className="trip-detail-section-kicker">Questions</div>
              <h2 className="trip-detail-section-title">Before you book.</h2>
              <div className="trip-detail-faq-list">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div className={`trip-detail-faq-item ${isOpen ? "open" : ""}`} key={faq.q}>
                      <button
                        className="trip-detail-faq-question"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.q}</span>
                        <span className="trip-detail-faq-icon">+</span>
                      </button>
                      <div
                        className="trip-detail-faq-answer"
                        style={{ maxHeight: isOpen ? 300 : 0 }}
                      >
                        <p>{faq.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="trip-detail-booking-column">
            <div className="trip-detail-booking-card">
              <div className="trip-detail-booking-body">
                <div className="trip-detail-booking-status">10 spots left</div>
                <h2 className="trip-detail-booking-title">
                  Bir × Barot Valley 2.0
                </h2>

                <div className="trip-detail-booking-info">
                  {[
                    ["Dates", "4–6 Sept"],
                    ["Duration", "3 Days"],
                    ["Location", "Himachal"],
                    ["Group", "Small Group"],
                  ].map(([label, value]) => (
                    <div className="trip-detail-booking-info-row" key={label}>
                      <span className="trip-detail-booking-info-label">{label}</span>
                      <span className="trip-detail-booking-info-value">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="trip-detail-booking-price">
                  <div>
                    <div className="trip-detail-booking-price-label">Starting from</div>
                    <strong>₹8,999</strong>
                  </div>
                  <span className="trip-detail-booking-price-note">per person</span>
                </div>

                <a className="trip-detail-book-btn" href="/booking?trip=bir-barot-valley">
                  Book Now →
                </a>

                <a className="trip-detail-whatsapp-btn" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Talk to Us on WhatsApp
                </a>

                <div className="trip-detail-trust-points">
                  <div>Secure Booking</div>
                  <div>Real Support</div>
                </div>

                <p className="trip-detail-booking-note">
                  By booking, you agree to the applicable booking, cancellation
                  and refund policies.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
