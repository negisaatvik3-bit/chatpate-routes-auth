import { useEffect, useState } from "react";

const navItems = [
  { href: "/trips", label: "Trips", num: "01" },
  { href: "#about", label: "About", num: "02" },
  { href: "/contact", label: "Contact", num: "03" },
];

export function HomeNav({
  onJoinTrip,
}: {
  onJoinTrip: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);

    return () =>
      document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          Chatpate Routes
        </div>

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href}>
                {item.label}
              </a>
            </li>
          ))}

          <li>
            <a
              href="#trips"
              className="nav-cta"
              onClick={(event) => {
                event.preventDefault();
                onJoinTrip();
              }}
            >
              Join Trip
            </a>
          </li>
        </ul>

        <button
          className="hamburger"
          aria-label="Open menu"
          type="button"
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div
        className={`mobile-menu${open ? " active" : ""}`}
      >
        <div className="mobile-menu-top">
          <div className="mobile-menu-brand">
            Chatpate Routes
          </div>

          <button
            className="menu-close"
            aria-label="Close menu"
            type="button"
            onClick={() => setOpen(false)}
          >
            <span />
            <span />
          </button>
        </div>

        <div className="mobile-menu-links">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              <span>{item.num}</span>
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#trips"
          className="mobile-menu-cta"
          onClick={(event) => {
            event.preventDefault();
            setOpen(false);
            onJoinTrip();
          }}
        >
          FIND MY TRIP
        </a>
      </div>
    </>
  );
}