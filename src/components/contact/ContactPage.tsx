import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import "./ContactPage.css";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="contact-page">
      <section className="contact-section">
        <div className="contact-wrap">
          <div className="contact-intro">
            <span className="contact-kicker">Get in touch</span>

            <h1>
              Don&apos;t be shy.
              <br />
              Just say <span>hi.</span>
            </h1>

            <p>
              Trip doubts, booking questions, random travel ideas
              or just want to say hello?
            </p>
          </div>

          <div className="contact-options">
            <a
              href="https://wa.me/919266770149"
              className="contact-option whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.5 3.5A11.8 11.8 0 0 0 12.08 0C5.55 0 .23 5.31.23 11.85c0 2.09.55 4.13 1.59 5.93L.12 24l6.36-1.67a11.82 11.82 0 0 0 5.6 1.42h.01c6.53 0 11.85-5.32 11.85-11.85 0-3.16-1.23-6.13-3.44-8.4ZM12.09 21.7h-.01a9.82 9.82 0 0 1-5.01-1.37l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.84 9.84 0 1 1 8.37 4.64Zm5.4-7.37c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                </svg>
              </div>

              <div className="contact-content">
                <h2>WhatsApp</h2>
                <p>Fastest way to reach us. We usually reply pretty quick.</p>
              </div>

              <span className="contact-arrow">↗</span>
            </a>

            <a
              href="mailto:hello@chatpateroutes.com"
              className="contact-option email"
            >
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 4H4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm0 3-8 5.5L4 7h16ZM4 17V8.75l7.43 5.1a1 1 0 0 0 1.14 0L20 8.75V17H4Z" />
                </svg>
              </div>

              <div className="contact-content">
                <h2>Email</h2>
                <p>Got something a little more detailed? Drop us a mail.</p>
              </div>

              <span className="contact-arrow">↗</span>
            </a>

            <a
              href="https://instagram.com/chatpateroutes"
              className="contact-option instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </div>

              <div className="contact-content">
                <h2>Instagram</h2>
                <p>See where we&apos;ve been, what we&apos;re eating and what&apos;s next.</p>
              </div>

              <span className="contact-arrow">↗</span>
            </a>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
