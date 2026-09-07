import { useEffect, useState } from "react";
import "./terms.css";


const sections = [
  ["agreement", "01 — Agreement"],
  ["trips", "02 — Trips"],
  ["booking", "03 — Booking"],
  ["payment", "04 — Payment"],
  ["cancellation", "05 — Cancellation"],
  ["changes", "06 — Trip Changes"],
  ["conduct", "07 — Conduct"],
  ["responsibility", "08 — Responsibility"],
  ["website", "09 — Website Use"],
  ["intellectual", "10 — Content"],
  ["liability", "11 — Liability"],
  ["contact", "12 — Contact"],
];

function TermsPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("terms-menu-open", menuOpen);
    return () => document.body.classList.remove("terms-menu-open");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="terms-page">
      <header>
        <nav className="terms-navbar">
          <div className="terms-nav-brand">Chatpate Routes</div>

          <ul className="terms-nav-links">
            <li><a href="/#trips">Trips</a></li>
            <li><a href="/#community">Community</a></li>
            <li><a href="/#about">About</a></li>
            <li><a href="/#contact">Contact</a></li>
            <li>
              <a href="/#trips" className="terms-nav-cta">Join Trip</a>
            </li>
          </ul>

          <button
            className="terms-hamburger"
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>

        <div className={`terms-mobile-menu ${menuOpen ? "active" : ""}`}>
          <div className="terms-mobile-menu-top">
            <div className="terms-mobile-menu-brand">Chatpate Routes</div>
            <button
              className="terms-menu-close"
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <span />
              <span />
            </button>
          </div>

          <div className="terms-mobile-menu-links">
            <a href="/#trips" onClick={closeMenu}><span>01</span>Trips</a>
            <a href="/#community" onClick={closeMenu}><span>02</span>Community</a>
            <a href="/#about" onClick={closeMenu}><span>03</span>About</a>
            <a href="/#contact" onClick={closeMenu}><span>04</span>Contact</a>
          </div>

          <a href="/#trips" className="terms-mobile-menu-cta" onClick={closeMenu}>
            FIND MY TRIP
          </a>
        </div>
      </header>

      <main>
        <div className="terms-hero-banner-container">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80"
            alt="Chatpate Routes Terms & Conditions Banner"
            className="terms-hero-banner-img"
          />
        </div>

        <section className="terms-hero">
          <p className="terms-eyebrow">LEGAL</p>
          <h1>
            Terms &amp;
            <br />
            Conditions.
          </h1>
          <p className="terms-intro">
            These terms explain how bookings, payments, trips, cancellations,
            and use of the Chatpate Routes website work.
          </p>
          <p className="terms-effective-date">
            Effective date: September 1, 2026
          </p>
        </section>

        <section className="terms-layout">
          <article className="terms-content">
            <section id="agreement">
              <span className="terms-policy-number">01</span>
              <h2>Agreement to these terms</h2>
              <p>
                By using the Chatpate Routes website, contacting us, or booking
                a trip through our platform, you agree to these Terms &amp;
                Conditions.
              </p>
              <p>
                If you do not agree with these terms, please do not use the
                website or make a booking.
              </p>
            </section>

            <section id="trips">
              <span className="terms-policy-number">02</span>
              <h2>Our trips</h2>
              <p>
                Chatpate Routes offers curated travel experiences, group trips,
                meetups, retreats, and other travel-related experiences.
              </p>
              <p>
                Trip information such as dates, itinerary, accommodation,
                activities, pricing, pickup points, and inclusions will be
                provided on the relevant trip page or communicated before
                booking.
              </p>
              <p>
                Trip details may change when reasonably necessary because of
                weather, local conditions, safety requirements, availability,
                operational issues, or circumstances outside our control.
              </p>
            </section>

            <section id="booking">
              <span className="terms-policy-number">03</span>
              <h2>Booking a trip</h2>
              <p>
                A booking is considered confirmed only after the required
                payment has been successfully completed and confirmation has
                been issued by Chatpate Routes.
              </p>
              <p>
                You are responsible for providing accurate information during
                the booking process, including your name, contact information,
                and traveller details.
              </p>
              <p>
                If incorrect information affects the booking or the ability to
                participate in a trip, Chatpate Routes cannot be responsible
                for resulting issues.
              </p>
            </section>

            <section id="payment">
              <span className="terms-policy-number">04</span>
              <h2>Payments</h2>
              <p>
                Payments for trips are processed through the payment methods
                made available on the website.
              </p>
              <p>
                Prices displayed on the website are shown in Indian Rupees
                unless stated otherwise.
              </p>
              <p>
                Your booking is subject to the price and payment terms shown
                at the time of booking.
              </p>
              <p>
                A payment may be marked as pending, failed, paid, or refunded
                depending on the payment status received from the payment
                provider.
              </p>
            </section>

            <section id="cancellation">
              <span className="terms-policy-number">05</span>
              <h2>Cancellation &amp; refunds</h2>
              <p>
                Cancellation and refund eligibility depends on the
                cancellation policy displayed for the specific trip at the
                time of booking.
              </p>
              <p>
                Where a trip-specific cancellation policy applies, that policy
                will take precedence for that booking.
              </p>
              <p>
                Refunds, where applicable, will be processed through the
                original payment method or another method reasonably
                communicated by Chatpate Routes.
              </p>
              <p>
                Payment gateway processing timelines may affect how long a
                refund takes to appear in your account.
              </p>
            </section>

            <section id="changes">
              <span className="terms-policy-number">06</span>
              <h2>Changes to trips</h2>
              <p>
                We may modify a trip itinerary, schedule, accommodation,
                meeting point, activity, or other operational detail when
                reasonably required.
              </p>
              <p>
                We will make reasonable efforts to communicate material changes
                to affected travellers.
              </p>
              <p>
                If Chatpate Routes cancels a trip, affected travellers will be
                informed about the available refund, rescheduling, or
                alternative arrangements, as applicable.
              </p>
            </section>

            <section id="conduct">
              <span className="terms-policy-number">07</span>
              <h2>Traveller conduct</h2>
              <p>
                Travellers are expected to behave respectfully toward other
                travellers, hosts, local communities, accommodation providers,
                guides, and staff.
              </p>
              <p>
                We may refuse participation or remove a traveller from a trip
                where their behaviour creates a serious safety, legal, or
                disruption concern.
              </p>
              <p>
                No refund is guaranteed where removal is caused by a
                traveller&apos;s misconduct or violation of applicable rules.
              </p>
            </section>

            <section id="responsibility">
              <span className="terms-policy-number">08</span>
              <h2>Traveller responsibility</h2>
              <p>
                Travellers are responsible for arriving at the communicated
                pickup or meeting point on time and carrying any documents,
                personal items, medication, identification, or other
                requirements relevant to their journey.
              </p>
              <p>
                Travellers should follow reasonable instructions provided by
                trip hosts, guides, transport providers, and local operators.
              </p>
              <p>
                Any specific eligibility, health, fitness, age, or equipment
                requirements will be communicated where relevant to a trip.
              </p>
            </section>

            <section id="website">
              <span className="terms-policy-number">09</span>
              <h2>Website use</h2>
              <p>
                You agree to use the Chatpate Routes website only for lawful
                purposes.
              </p>
              <p>
                You must not attempt to interfere with the website, gain
                unauthorized access to accounts or systems, misuse booking
                functionality, submit false information, or use the platform
                for fraudulent activity.
              </p>
              <p>
                We may suspend or restrict access where reasonably necessary to
                protect the website, our users, or our services.
              </p>
            </section>

            <section id="intellectual">
              <span className="terms-policy-number">10</span>
              <h2>Content &amp; intellectual property</h2>
              <p>
                The Chatpate Routes name, branding, website design, written
                content, graphics, photographs, logos, and other original
                materials provided by Chatpate Routes are protected by
                applicable intellectual property laws.
              </p>
              <p>
                You may not copy, reproduce, modify, distribute, or commercially
                use our content without prior permission.
              </p>
            </section>

            <section id="liability">
              <span className="terms-policy-number">11</span>
              <h2>Responsibility &amp; liability</h2>
              <p>
                Travel involves circumstances that may be outside our control,
                including weather, traffic, natural events, government
                restrictions, local conditions, delays, and actions of
                third-party service providers.
              </p>
              <p>
                Chatpate Routes will take reasonable steps to provide the
                experience described for each trip, but cannot guarantee that
                every part of a journey will occur exactly as originally
                planned.
              </p>
              <p>
                Nothing in these terms is intended to exclude or limit any
                liability that cannot legally be excluded or limited under
                applicable law.
              </p>
            </section>

            <section id="contact">
              <span className="terms-policy-number">12</span>
              <h2>Questions?</h2>
              <p>
                If you have questions about these Terms &amp; Conditions, a
                booking, cancellation, or a specific trip, contact Chatpate
                Routes before travelling.
              </p>

              <div className="terms-contact-card">
                <p>
                  <strong>WhatsApp</strong>
                  <br />
                  <a href="https://wa.me/919266770149">+91 92667 70149</a>
                </p>

                <p>
                  <strong>Instagram</strong>
                  <br />
                  <a
                    href="https://www.instagram.com/chatpate.routes.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @chatpate.routes.in
                  </a>
                </p>
              </div>
            </section>
          </article>

          <aside className="terms-sidebar">
            <span>ON THIS PAGE</span>
            {sections.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </aside>
        </section>
      </main>

      <footer className="terms-footer">
        <span>© 2026 Chatpate Routes</span>
        <span>Made for people who&apos;d rather be somewhere else.</span>
        <span>
          Made with ❤️ by{" "}
          <a
            href="https://techlearnsolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            TechLearn Solutions
          </a>
        </span>
      </footer>
    </div>
  );
}

export { TermsPage };
