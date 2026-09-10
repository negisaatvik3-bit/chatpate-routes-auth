import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/" className="nav-brand" onClick={closeMenu}>
        Chatpate Routes
      </Link>

      {/* Desktop Navigation */}
      <ul className="nav-links">
        <li>
          <a href="/#trips">Trips</a>
        </li>
        <li>
          <a href="/#about">About</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
        <li>
          <a href="/#trips" className="nav-cta">
            Join Trip
          </a>
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="hamburger"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <ul className="mobile-nav-links">
          <li>
            <a href="/#trips" onClick={closeMenu}>
              Trips
            </a>
          </li>
           {/* <li>
           <a href="/#community" onClick={closeMenu}>
              Community
            </a> 
          </li> */}
          <li>
            <a href="/#about" onClick={closeMenu}>
              About
            </a>
          </li>
          <li>
            <a href="/contact" onClick={closeMenu}>
              Contact
            </a>
          </li>
          <li>
            <a href="/#trips" className="nav-cta" onClick={closeMenu}>
              Join Trip
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;