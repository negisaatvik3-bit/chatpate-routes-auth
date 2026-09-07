import { homeImages } from "./images";

export function HeroSection({
  onFindTrip,
}: {
  onFindTrip: (destination: string, travelDate: string) => void;
}) {
  return (
    <header className="hero">
      <div className="hero-content">
        <h1 className="hero-title">So, where are we going?</h1>

        <p className="hero-subtitle">
          Curated journeys, interesting places, and great people to travel with.
        </p>

        <div className="hero-search active">
          <div className="search-field">
            <label htmlFor="destinationInput">Destination</label>
            <input type="text" id="destinationInput" placeholder="Where do you want to go?" />
          </div>

          <div className="search-divider" />

          <div
            className="search-field date-field"
            onClick={() => {
              const el = document.getElementById("dateInput") as
                (HTMLInputElement & { showPicker?: () => void }) | null;
              if (el?.showPicker) el.showPicker();
              else el?.focus();
            }}
          >
            <label htmlFor="dateInput">When</label>
            <input type="date" id="dateInput" />
          </div>

          <button
            className="search-submit"
            type="button"
            onClick={() => {
              const destination = (document.getElementById("destinationInput") as HTMLInputElement)
                .value;
              const travelDate = (document.getElementById("dateInput") as HTMLInputElement).value;
              onFindTrip(destination, travelDate);
            }}
          >
            Find My Trip
          </button>
        </div>
      </div>
    </header>
  );
}

const postcards = [
  {
    number: "01",
    title: (
      <>
        Go where the map
        <br />
        gets interesting.
      </>
    ),
    description: "Take the route less ordinary. Find places worth getting lost in.",
    image: homeImages.route,
    alt: "Scenic mountain route",
    reverse: false,
  },
  {
    number: "02",
    title: (
      <>
        Eat like
        <br />a local.
      </>
    ),
    description: "A little sugar & spice never hurt anyone.",
    image: homeImages.food,
    alt: "Local food experience",
    reverse: true,
  },
  {
    number: "03",
    title: (
      <>
        Find your kind
        <br />
        of crazy.
      </>
    ),
    description: "Or calm. Your people are here.",
    image: homeImages.people,
    alt: "People travelling together",
    reverse: false,
  },
];

export function WhySection() {
  return (
    <section className="why-chatpate" id="community">
      <div className="why-chatpate-header">
        <div className="why-chatpate-heading">
          <p className="section-eyebrow">WHY CHATPATE ROUTES?</p>

          <h2 className="section-title">
            Boring Travel is
            <br />
            just not our vibe.
          </h2>

          <a
            href="https://www.instagram.com/chatpate.routes.in/?hl=en"
            className="community-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join Community
            <span>↗</span>
          </a>
        </div>
      </div>

      <div className="postcard-grid">
        {postcards.map((card) => (
          <article className={`stamp${card.reverse ? " reverse" : ""}`} key={card.number}>
            <div className="card-content">
              {card.reverse ? (
                <>
                  <div className="card-copy">
                    <h3 className="card-title">{card.title}</h3>
                    <p className="card-description">{card.description}</p>
                  </div>
                  <div className="card-header">
                    <span className="card-number">{card.number}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="card-header">
                    <span className="card-number">{card.number}</span>
                  </div>
                  <div className="card-copy">
                    <h3 className="card-title">{card.title}</h3>
                    <p className="card-description">{card.description}</p>
                  </div>
                </>
              )}
            </div>

            <img className="card-image" src={card.image} alt={card.alt} loading="lazy" />
          </article>
        ))}
      </div>
    </section>
  );
}

export function FounderSection() {
  return (
    <section className="founder-section" id="about">
      <div className="founder-inner">
        <div className="founder-image-wrap">
          <img
            src={homeImages.founder}
            alt="Nishu Malik — Founder of Chatpate Routes"
            className="founder-image"
            loading="lazy"
          />
        </div>

        <div className="founder-content">
          <p className="founder-eyebrow">A note from Nishu</p>

          <h2 className="founder-title">
            A little story
            <br />
            behind the routes.
          </h2>

          <div className="founder-letter">
            <p>
              I started Chatpate Routes because I’ve always felt that travelling should be a little
              less predictable. Not just visiting the usual places, following a fixed itinerary and
              coming back with the same pictures everyone has.
            </p>
            <p>
              I wanted to create trips where you discover a random little place, eat something
              ridiculously good, take the longer route just because, and meet people who were
              strangers when the trip began.
            </p>
            <p>Basically, travel with a little more curiosity, chaos and chatpata-neess.</p>
          </div>

          <div className="founder-signature">
            <span>— Nishu Malik</span>
            <small>Founder, Chatpate Routes</small>
          </div>
        </div>
      </div>
    </section>
  );
}

const archives = [
  {
    image: homeImages.archive01,
    alt: "Chatpate Routes travel experience",
    cls: "tall",
    num: "01",
    caption: "Found somewhere worth stopping for.",
  },
  {
    image: homeImages.archive02,
    alt: "Local food experience",
    cls: "",
    num: "02",
    caption: "Someone ordered too much food. Again.",
  },
  {
    image: homeImages.archive03,
    alt: "Travellers enjoying a trip",
    cls: "medium",
    num: "03",
    caption: "Strangers → group chat → friends.",
  },
  {
    image: homeImages.archive04,
    alt: "Mountain travel experience",
    cls: "",
    num: "04",
    caption: "Took the longer route. No regrets.",
  },
  {
    image: homeImages.archive05,
    alt: "Travel moment",
    cls: "tall",
    num: "05",
    caption: "No plan. Somehow the best day.",
  },
  {
    image: homeImages.archive06,
    alt: "Friends travelling together",
    cls: "",
    num: "06",
    caption: "This wasn't on the itinerary.",
  },
];

export function ArchivesSection() {
  return (
    <section className="archives-section">
      <div className="archives-header">
        <div>
          <p className="archives-eyebrow">THE CHATPATE ARCHIVES</p>
          <h2 className="archives-title">
            The stories <br /> <i>you</i> didn’t plan for.
          </h2>
        </div>

        <p className="archives-intro">
          The detours, the meals, <br />
          the laughs, the people <br />
          that’s the Chatpate part.
        </p>
      </div>

      <div className="masonry-grid">
        {archives.map((item) => (
          <figure className={`archive-item ${item.cls}`.trim()} key={item.num}>
            <img src={item.image} alt={item.alt} loading="lazy" />
            <figcaption>
              <span>{item.num}</span>
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="archives-cta">
        <a href="#community" className="archives-btn">
          See the Community
          <span>↗</span>
        </a>
      </div>
    </section>
  );
}

export function MeetupsSection() {
  return (
    <section className="meetups" id="meetups">
      <div className="meetups-inner">
        <div className="meetups-header">
          <div className="meetups-heading">
            <p className="meetups-eyebrow">MEETUPS · DELHI</p>
            <h2>
              Before the trip comes
              <br />
              the group chat.
            </h2>
          </div>

          <p className="meetups-intro">
            Delhi meetups for people who'd rather talk about their next escape than their Monday
            plans.
          </p>
        </div>

        <div className="meetup-feature">
          <div className="meetup-image">
            <img src={homeImages.meetup} alt="Chatpate Routes Delhi meetup" loading="lazy" />
            <span className="meetup-location">DELHI</span>
          </div>

          <div className="meetup-content">
            <div className="meetup-meta">
              <span>UPCOMING</span>
              <span>·</span>
              <span>DELHI</span>
            </div>

            <h3>
              Chai, Charcha
              <br />
              &amp; What's Next?
            </h3>

            <p>
              A casual evening to meet fellow Chatpate people, swap travel stories, discover new
              places, and maybe end up planning the next trip together.
            </p>

            <div className="meetup-details">
              <div>
                <span>DATE</span>
                <strong>Coming Soon</strong>
              </div>
              <div>
                <span>TIME</span>
                <strong>6:30 PM</strong>
              </div>
              <div>
                <span>PLACE</span>
                <strong>Delhi</strong>
              </div>
            </div>

            <a
              href="https://wa.me/919266770149?text=Hey!%20I%E2%80%99m%20in%20for%20the%20next%20meetup"
              target="_blank"
              rel="noopener noreferrer"
              className="meetup-cta"
            >
              Join the Meetup
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ItinerarySection() {
  return (
    <section className="itinerary">
      <div className="itinerary-inner">
        <div className="eyebrow">Your Route Could Be Next</div>

        <h2>Got a route, hidden gem or weekend plan worth sharing?</h2>

        <a
          href="https://wa.me/919266770149?text=Hey!%20I%20have%20a%20route%20I%E2%80%99d%20love%20to%20share%20with%20Chatpate%20Routes."
          target="_blank"
          rel="noopener noreferrer"
          className="itinerary-btn"
        >
          Submit Your Itinerary
          <span>↗</span>
        </a>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h2>
            Chatpate
            <br />
            Routes.
          </h2>
          <p>Boring Travel is just not our vibe.</p>
        </div>

        <div className="footer-links">
          <div className="footer-link-group">
            <span>Explore</span>
            <a href="/trips">Trips</a>
            <a href="#community">Community</a>
            <a href="#meetups">Meetups</a>
            <a href="#about">About</a>
          </div>

          <div className="footer-link-group">
            <span>Connect</span>
            <a
              href="https://www.instagram.com/chatpate.routes.in/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a href="https://wa.me/919266770149" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>

          <div className="footer-link-group">
            <span>Legal</span>
            <a href="#contact">Privacy Policy</a>
            <a href="#contact">Terms &amp; Conditions</a>
            <a href="#contact">Returns &amp; Refunds</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Chatpate Routes</span>
        <span>
          Made with ❤️ by{" "}
          <a href="https://techlearnsolutions.com/" target="_blank" rel="noopener noreferrer">
            TechLearn Solutions
          </a>
        </span>
      </div>
    </footer>
  );
}
