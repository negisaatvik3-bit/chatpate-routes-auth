import { useEffect, useState } from "react";

const links = [
  { href: "#trips", label: "Trips", num: "01" },
  { href: "#community", label: "Community", num: "02" },
  { href: "#about", label: "About", num: "03" },
  { href: "#contact", label: "Contact", num: "04" },
];

export function HomeNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">Chatpate Routes</div>

        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
          <li>
            <a href="#trips" className="nav-cta">
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

      <div className={`mobile-menu${open ? " active" : ""}`}>
        <div className="mobile-menu-top">
          <div className="mobile-menu-brand">Chatpate Routes</div>
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
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              <span>{l.num}</span>
              {l.label}
            </a>
          ))}
        </div>

        <a href="#trips" className="mobile-menu-cta" onClick={() => setOpen(false)}>
          FIND MY TRIP
        </a>
      </div>
    </>
  );
}
