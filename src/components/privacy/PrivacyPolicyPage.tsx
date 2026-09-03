import { useEffect, useState } from "react";
import "./privacy-policy.css";

const navLinks = [
  { href: "/trips", label: "Trips", num: "01" },
  { href: "/community", label: "Community", num: "02" },
  { href: "/about", label: "About", num: "03" },
  { href: "/contact", label: "Contact", num: "04" },
];

const sidebarLinks = [
  ["#information", "Information We Collect"],
  ["#use", "How We Use It"],
  ["#payments", "Payments"],
  ["#third-party", "Third-Party Services"],
  ["#security", "Data Security"],
  ["#retention", "Data Retention"],
  ["#rights", "Your Rights"],
  ["#contact", "Contact"],
];

export function PrivacyPolicyPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("privacy-menu-open", menuOpen);
    return () => document.body.classList.remove("privacy-menu-open");
  }, [menuOpen]);

  return (
    <div className="privacy-page">
      <header>
        <nav className="privacy-navbar">
          <a className="privacy-nav-brand" href="/">Chatpate Routes</a>
          <ul className="privacy-nav-links">
            {navLinks.map((link) => (
              <li key={link.href}><a href={link.href}>{link.label}</a></li>
            ))}
            <li><a className="privacy-nav-cta" href="/trips">Join Trip</a></li>
          </ul>
          <button className="privacy-hamburger" type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <span /><span /><span />
          </button>
        </nav>

        <div className={`privacy-mobile-menu ${menuOpen ? "active" : ""}`}>
          <div className="privacy-mobile-menu-top">
            <a className="privacy-mobile-menu-brand" href="/" onClick={() => setMenuOpen(false)}>Chatpate Routes</a>
            <button className="privacy-menu-close" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <span /><span />
            </button>
          </div>
          <div className="privacy-mobile-menu-links">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                <span>{link.num}</span>{link.label}
              </a>
            ))}
          </div>
          <a className="privacy-mobile-menu-cta" href="/trips" onClick={() => setMenuOpen(false)}>FIND MY TRIP</a>
        </div>
      </header>

      <main>
        <div className="privacy-hero-banner-container">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80"
            alt="Chatpate Routes Privacy Policy Banner"
            className="privacy-hero-banner-img"
          />
        </div>

        <section className="privacy-hero">
          <p className="privacy-eyebrow">LEGAL</p>
          <h1>Privacy<br />Policy.</h1>
          <p className="privacy-intro">
            We respect your privacy. Here&apos;s what information we collect, why we need it, and how we handle it when you use Chatpate Routes.
          </p>
          <p className="privacy-effective-date">Effective date: September 1, 2026</p>
        </section>

        <section className="privacy-layout">
          <article className="privacy-content">
            <PolicySection id="information" number="01" title="Information We Collect">
              <p>We collect only information reasonably required to provide and manage our services.</p>
              <ul><li>Name</li><li>Email address</li><li>Phone number</li><li>Account information</li><li>Traveller information</li><li>Trip and booking details</li><li>Payment and transaction information</li><li>Information submitted through forms</li><li>Messages and communications you send to us</li><li>Basic technical information required to operate and secure the website</li></ul>
            </PolicySection>

            <PolicySection id="use" number="02" title="How We Use Your Information">
              <p>We may use your information to:</p>
              <ul><li>Create and manage your account</li><li>Process and manage bookings</li><li>Process and verify payments</li><li>Provide trip and booking information</li><li>Respond to enquiries and support requests</li><li>Communicate important updates regarding your booking or trip</li><li>Operate, maintain, and improve our website</li><li>Prevent fraud, misuse, or unauthorized access</li><li>Comply with applicable legal obligations</li></ul>
              <p>We will not use your personal information for purposes materially unrelated to the reason it was collected without appropriate notice or consent where required by law.</p>
            </PolicySection>

            <PolicySection id="payments" number="03" title="Payments">
              <p>Payments may be processed through third-party payment providers, including Razorpay.</p>
              <p>Chatpate Routes does not intend to store complete card numbers, CVV numbers, UPI PINs, banking passwords, or similar payment credentials.</p>
              <p>Payment providers may independently collect and process payment information under their own terms and privacy policies.</p>
              <p>We may retain transaction-related information such as payment amount, transaction ID, payment status, and booking reference for booking management, accounting, refunds, dispute resolution, and legal requirements.</p>
            </PolicySection>

            <PolicySection id="third-party" number="04" title="Third-Party Services">
              <p>We may use third-party services to operate the website and provide our services, including:</p>
              <ul><li>Supabase for authentication, database, and storage</li><li>Razorpay for payment processing</li><li>Vercel or other hosting infrastructure</li><li>Google for authentication where enabled</li><li>WhatsApp for customer communication</li><li>Instagram and other social platforms</li></ul>
              <p>Information may be shared with these providers only to the extent reasonably required for the relevant service.</p>
              <p>Third-party providers operate under their own terms and policies.</p>
            </PolicySection>

            <PolicySection number="05" title="Trip Operations">
              <p>When you book a trip, certain information may need to be shared with the trip host, accommodation provider, transport provider, activity provider, or other service provider involved in delivering that trip.</p>
              <p>Only information reasonably necessary to coordinate and provide the booked service should be shared.</p>
            </PolicySection>

            <PolicySection number="06" title="WhatsApp & Social Media">
              <p>If you contact Chatpate Routes through WhatsApp, Instagram, or another social platform, your communication is also subject to the privacy policy and terms of that platform.</p>
              <p>We may use information from these communications to respond to enquiries, assist with bookings, and provide customer support.</p>
            </PolicySection>

            <PolicySection id="security" number="07" title="Data Security">
              <p>We take reasonable measures to protect personal information against unauthorized access, misuse, loss, or disclosure.</p>
              <p>Access to personal information is limited to people and service providers who reasonably need it to operate our services.</p>
              <p>However, no online system or method of electronic transmission can be guaranteed to be completely secure.</p>
            </PolicySection>

            <PolicySection id="retention" number="08" title="Data Retention">
              <p>We retain personal information for only as long as reasonably necessary for the purpose for which it was collected, including providing services, maintaining booking and transaction records, resolving disputes, preventing misuse, and complying with applicable legal obligations.</p>
              <p>When information is no longer reasonably required, it may be deleted or otherwise handled in accordance with applicable law.</p>
            </PolicySection>

            <PolicySection id="rights" number="09" title="Your Rights">
              <p>Subject to applicable law, you may contact us to:</p>
              <ul><li>Request access to personal information we hold about you</li><li>Request correction of inaccurate information</li><li>Request deletion of information where legally permitted</li><li>Withdraw consent where processing is based on consent</li><li>Raise a privacy-related concern or grievance</li></ul>
              <p>We may need to verify your identity before processing a request.</p>
            </PolicySection>

            <PolicySection number="10" title="Marketing">
              <p>We may send information about trips, meetups, community activities, or other Chatpate Routes services where permitted by applicable law.</p>
              <p>You may request that we stop sending non-essential promotional communications.</p>
              <p>We may continue sending essential communications relating to your account, bookings, payments, trips, cancellations, or other services you have requested.</p>
            </PolicySection>

            <PolicySection number="11" title="Children's Privacy">
              <p>Our services are not intentionally directed at children.</p>
              <p>If you believe that personal information has been provided to us by a child without the appropriate authorization required by applicable law, please contact us so that we can review the matter and take appropriate action.</p>
            </PolicySection>

            <PolicySection number="12" title="Changes to This Policy">
              <p>We may update this Privacy Policy when our services, technology, or legal requirements change.</p>
              <p>The updated version will be published on this page with a revised effective date.</p>
            </PolicySection>

            <PolicySection id="contact" number="13" title="Contact & Privacy Grievances">
              <p>For privacy questions, requests, or grievances, contact Chatpate Routes through:</p>
              <div className="privacy-contact-card">
                <p><strong>WhatsApp</strong><br /><a href="https://wa.me/919266770149">+91 92667 70149</a></p>
                <p><strong>Instagram</strong><br /><a href="https://www.instagram.com/chatpate.routes.in/" target="_blank" rel="noopener noreferrer">@chatpate.routes.in</a></p>
              </div>
              <p>Please mention <strong>&ldquo;Privacy Request&rdquo;</strong> when contacting us regarding a privacy matter.</p>
            </PolicySection>

            <PolicySection number="14" title="Applicable Law">
              <p>This Privacy Policy is governed by the applicable laws of India.</p>
              <p>Nothing in this Privacy Policy limits any rights available to you under applicable law.</p>
            </PolicySection>
          </article>

          <aside className="privacy-sidebar">
            <span>ON THIS PAGE</span>
            {sidebarLinks.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
          </aside>
        </section>
      </main>

      <footer className="privacy-footer">
        <span>© 2026 Chatpate Routes</span>
        <span>Made for people who&apos;d rather be somewhere else.</span>
        <span>Made with ❤️ by <a href="https://techlearnsolutions.com/" target="_blank" rel="noopener noreferrer">TechLearn Solutions</a></span>
      </footer>
    </div>
  );
}

function PolicySection({ id, number, title, children }: { id?: string; number: string; title: string; children: React.ReactNode }) {
  return <section id={id}><span className="privacy-policy-number">{number}</span><h2>{title}</h2>{children}</section>;
}
