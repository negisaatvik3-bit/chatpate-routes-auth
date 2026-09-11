import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import "./Navbar.css";

type NavbarProps = {
  activePage?: "trips" | "about" | "contact";
};

const navItems = [
  { href: "/trips", label: "Trips", num: "01", page: "trips" },
  { href: "/#about", label: "About", num: "02", page: "about" },
  { href: "/contact", label: "Contact", num: "03", page: "contact" },
] as const;

export function Navbar({ activePage }: NavbarProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isMenuOpen);

    return () => document.body.classList.remove("menu-open");
  }, [isMenuOpen]);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          Chatpate Routes
        </Link>

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={activePage === item.page ? "active" : undefined}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/login?redirect=%2Ftrips" className="nav-cta" onClick={closeMenu}>
              Join Trip
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="hamburger"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`mobile-menu${isMenuOpen ? " active" : ""}`}>
        <div className="mobile-menu-top">
          <Link to="/" className="mobile-menu-brand" onClick={closeMenu}>
            Chatpate Routes
          </Link>
          <button
            type="button"
            className="menu-close"
            onClick={closeMenu}
            aria-label="Close menu"
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
              className={activePage === item.page ? "active" : undefined}
              onClick={closeMenu}
            >
              <span>{item.num}</span>
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="/login?redirect=%2Ftrips"
          className="mobile-menu-cta"
          onClick={closeMenu}
        >
          FIND MY TRIP
        </a>
      </div>
    </>
  );
}

export default Navbar;
