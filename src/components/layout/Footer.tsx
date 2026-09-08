import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <h2>
            Chatpate
            <br />
            Routes.
          </h2>

          <p>Boring Travel is just not our vibe.</p>
        </div>

        {/* Links */}
        <div className="footer-links">
          {/* Explore */}
          <div className="footer-link-group">
            <span>Explore</span>

            <a href="/#trips">Trips</a>
            <a href="/#community">Community</a>
            <a href="/#meetups">Meetups</a>
            <a href="/#about">About</a>
          </div>

          {/* Connect */}
          <div className="footer-link-group">
            <span>Connect</span>

            <a
              href="https://www.instagram.com/chatpate.routes.in/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>

            <a
              href="https://wa.me/919266770149"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>

          {/* Legal */}
          <div className="footer-link-group">
            <span>Legal</span>

            <Link to="/privacy-policy">Privacy Policy</Link>

            <Link to="/terms">Terms & Conditions</Link>

            <a href="/returns-refunds">Returns & Refunds</a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <span>© 2026 Chatpate Routes</span>

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
      </div>
    </footer>
  );
}