import { useEffect, useState } from "react";

const links = [
  { href: "/trips", label: "Trips", num: "01", active: true },
  { href: "/about", label: "About", num: "03" },
  { href: "/contact", label: "Contact", num: "04" },
];

export function TripsNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <>
      <nav className="trips-navbar">
        <div className="trips-nav-brand">Chatpate Routes</div>
        <ul className="trips-nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={link.active ? "active" : ""}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="trips-hamburger"
          aria-label="Open menu"
          type="button"
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`trips-mobile-menu${open ? " active" : ""}`}>
        <div className="trips-mobile-menu-top">
          <div className="trips-mobile-menu-brand">Chatpate Routes</div>
          <button
            className="trips-menu-close"
            aria-label="Close menu"
            type="button"
            onClick={() => setOpen(false)}
          >
            <span />
            <span />
          </button>
        </div>

        <div className="trips-mobile-menu-links">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={link.active ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              <span>{link.num}</span>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
