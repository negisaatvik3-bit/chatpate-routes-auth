import { FormEvent, useEffect, useMemo, useState } from "react";
import "./booking.css";
import QRCode from "../common/QRCode";

import birBarotImage from "@/assets/bir-copy.png";

const GOOGLE_SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbwyv3rXTOjUEhY6vr_6h_W-yq72nBcKPUt_yeYNvuEY8cU9L3mYyfQCKsK7OdaMXGSx/exec";

const WHATSAPP_NUMBER = "919266770149";

const BOOKINGS_STORAGE_KEY = "chatpate_routes_bookings";

type Trip = {
  title: string;
  dates: string;
  duration: string;
  location: string;
  availability: string;
  price: number;
  image: string;
};

const trips: Record<string, Trip> = {
  "bir-barot-valley": {
    title: "Bir × Barot Valley 2.0",
    dates: "4–6 September 2026",
    duration: "3 Days · 2 Nights",
    location: "Himachal Pradesh",
    availability: "10 spots left",
    price: 8999,
    image: birBarotImage,
  },
};

function formatPrice(amount: number) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function generateBookingID() {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `CR-${date}-${random}`;
}

async function saveBookingToGoogleSheets(bookingData: unknown) {
  if (!GOOGLE_SHEETS_URL) return false;

  try {
    await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(bookingData),
    });

    return true;
  } catch (error) {
    console.error("Google Sheets error:", error);
    return false;
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read payment screenshot."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Could not read payment screenshot."));
    };

    reader.readAsDataURL(file);
  });
}

export function BookingPage() {
  const [tripSlug, setTripSlug] = useState("bir-barot-valley");

  const [travellers, setTravellers] = useState("1");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [travellerNames, setTravellerNames] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [whatsappURL, setWhatsappURL] = useState("#");

  const [paymentScreenshot, setPaymentScreenshot] =
    useState<File | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setTripSlug(params.get("trip") || "bir-barot-valley");
  }, []);

  const trip = useMemo(
    () => trips[tripSlug] ?? trips["bir-barot-valley"]!,
    [tripSlug],
  );

  const travellerCount = Number(travellers) || 1;

  const totalAmount = trip.price * travellerCount;

  const advanceAmount = Math.round(totalAmount * 0.6);

  const breakdown = `${formatPrice(trip.price)} × ${travellerCount} ${
    travellerCount === 1 ? "traveller" : "travellers"
  }`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !travellers
    ) {
      window.alert("Please fill in all required details.");
      return;
    }

    if (!paymentScreenshot) {
      window.alert("Please upload your payment screenshot.");
      return;
    }

    setSubmitting(true);

    try {
      const bookingID = generateBookingID();

      const timestamp = new Date().toISOString();

      const screenshotDataUrl =
        await fileToDataUrl(paymentScreenshot);

      const bookingData = {
        bookingId: bookingID,
        timestamp,

        trip: trip.title,
        tripSlug,
        tripDate: trip.dates,

        name: name.trim(),
        whatsapp: phone.trim(),
        email: email.trim(),

        travellers: travellerCount,
        travellerNames: travellerNames.trim(),

        pricePerPerson: trip.price,
        totalAmount,
        advanceAmount,

        notes: message.trim(),

        paymentStatus: "Submitted",
        bookingStatus: "Pending",

        paymentScreenshot: screenshotDataUrl,
        paymentScreenshotName: paymentScreenshot.name,
      };

      /*
       * TEMPORARY FRONTEND STORAGE
       *
       * This allows the Admin Bookings page to access
       * bookings before the backend is connected.
       */
      const existingBookings = JSON.parse(
        localStorage.getItem(BOOKINGS_STORAGE_KEY) || "[]",
      );

      existingBookings.push(bookingData);

      localStorage.setItem(
        BOOKINGS_STORAGE_KEY,
        JSON.stringify(existingBookings),
      );

      /*
       * Keep Google Sheets logging for now.
       *
       * Do not send the actual screenshot to Google Sheets.
       */
      await saveBookingToGoogleSheets({
        ...bookingData,
        paymentScreenshot: undefined,
      });

      const whatsappMessage = `Hi Chatpate Routes!

I'd like to confirm my booking.

Booking ID: ${bookingID}

Trip: ${trip.title}
Dates: ${trip.dates}
Travellers: ${travellerCount}

Name: ${name.trim()}
WhatsApp: ${phone.trim()}
Email: ${email.trim()}

Price per person: ${formatPrice(trip.price)}
Total Amount: ${formatPrice(totalAmount)}
Advance Paid: ${formatPrice(advanceAmount)}

Traveller Names:
${travellerNames.trim() || "Same as above"}

Notes:
${message.trim() || "None"}

I have completed the 60% advance payment.

I have submitted my payment screenshot through the website.`;

      const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          whatsappMessage,
        )}`;

      setWhatsappURL(url);

      setSubmitted(true);
    } catch (error) {
      console.error("Booking submission error:", error);

      window.alert(
        "Something went wrong while submitting your booking. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="booking-page-react">
      <nav className="navbar">
        <a href="/" className="nav-brand">
          Chatpate Routes
        </a>

        <a href="/trips" className="nav-back">
          ← Back to Trips
        </a>
      </nav>

      <main className="booking-page">
        <div className="booking-container">
          <section className="booking-main">
            <div className="page-kicker">
              Complete Your Booking
            </div>

            <h1 className="page-title">
              Let's make
              <br />
              this trip happen.
            </h1>

            <p className="page-intro">
              Fill in your details, complete the payment and
              confirm your booking with us on WhatsApp.
            </p>

            {!submitted ? (
              <form
                className="booking-form-card"
                onSubmit={handleSubmit}
              >
                {/* ========================= */}
                {/* TRAVELLER DETAILS */}
                {/* ========================= */}

                <div className="form-section">
                  <h2 className="form-section-title">
                    Traveller Details
                  </h2>

                  <div className="form-grid">
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="name"
                      >
                        Full Name
                      </label>

                      <input
                        className="form-input"
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="phone"
                      >
                        WhatsApp
                      </label>

                      <input
                        className="form-input"
                        id="phone"
                        type="tel"
                        placeholder="Your WhatsApp number"
                        autoComplete="tel"
                        required
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="email"
                      >
                        Email
                      </label>

                      <input
                        className="form-input"
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="travellers"
                      >
                        Travellers
                      </label>

                      <select
                        id="travellers"
                        className="form-select"
                        required
                        value={travellers}
                        onChange={(e) =>
                          setTravellers(e.target.value)
                        }
                      >
                        <option value="">
                          Select
                        </option>

                        <option value="1">
                          1 Traveller
                        </option>

                        <option value="2">
                          2 Travellers
                        </option>

                        <option value="3">
                          3 Travellers
                        </option>

                        <option value="4">
                          4 Travellers
                        </option>

                        <option value="5">
                          5 Travellers
                        </option>
                      </select>
                    </div>

                    <div className="form-group full">
                      <label
                        className="form-label"
                        htmlFor="travellerNames"
                      >
                        Traveller Names
                      </label>

                      <textarea
                        id="travellerNames"
                        className="form-textarea"
                        placeholder="Enter the full names of all travellers"
                        value={travellerNames}
                        onChange={(e) =>
                          setTravellerNames(e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group full">
                      <label
                        className="form-label"
                        htmlFor="message"
                      >
                        Anything we should know?
                      </label>

                      <textarea
                        id="message"
                        className="form-textarea"
                        placeholder="Dietary requirements, questions, special requests..."
                        value={message}
                        onChange={(e) =>
                          setMessage(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* ========================= */}
                {/* COMPLETE PAYMENT */}
                {/* ========================= */}

                <div className="form-section">
                  <h2 className="form-section-title">
                    Complete Payment
                  </h2>

                  <div className="payment-box">
                    <h3 className="payment-title">
                      Scan & Pay
                    </h3>

                    <p className="payment-description">
                      Scan the QR code using your preferred
                      UPI app and pay the 60% advance amount
                      shown below.
                    </p>

                    <div className="payment-content">
                      <div className="qr-wrapper">
                        <QRCode />
                      </div>

                      <div className="payment-details">
                        <div className="payment-amount-label">
                          Advance to Pay
                        </div>

                        <div className="payment-amount">
                          {formatPrice(advanceAmount)}
                        </div>

                        <div className="payment-breakdown">
                          60% of {formatPrice(totalAmount)}
                        </div>

                        <p className="payment-note">
                          Complete the advance payment,
                          upload your payment screenshot
                          below, and submit it for
                          verification.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ========================= */}
                  {/* PAYMENT SCREENSHOT */}
                  {/* ========================= */}

                  <div className="payment-screenshot-section">
                    <label
                      className="form-label"
                      htmlFor="paymentScreenshot"
                    >
                      Payment Screenshot *
                    </label>

                    <input
                      id="paymentScreenshot"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="form-input"
                      required
                      onChange={(e) =>
                        setPaymentScreenshot(
                          e.target.files?.[0] ?? null,
                        )
                      }
                    />

                    {paymentScreenshot && (
                      <p className="payment-screenshot-name">
                        Selected:{" "}
                        {paymentScreenshot.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* ========================= */}
                {/* SUBMIT */}
                {/* ========================= */}

                <div className="submit-section">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Submitting Payment..."
                      : "Submit Payment →"}
                  </button>

                  <p className="submit-note">
                    Your booking details and payment
                    screenshot will be submitted for
                    verification.
                  </p>
                </div>
              </form>
            ) : (
              /* ========================= */
              /* SUCCESS SCREEN */
              /* ========================= */

              <div className="booking-success active">
                <div className="success-icon">
                  ✓
                </div>

                <h2>Almost there.</h2>

                <p>
                  Your booking details and payment
                  screenshot have been submitted
                  successfully. Your payment is now being
                  verified by the Chatpate Routes team.
                </p>

                <a
                  href={whatsappURL}
                  className="whatsapp-success-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Continue on WhatsApp →
                </a>
              </div>
            )}
          </section>

          {/* ========================= */}
          {/* TRIP SUMMARY */}
          {/* ========================= */}

          <aside className="booking-summary">
            <div className="summary-card">
              <div className="summary-image">
                <img
                  src={trip.image}
                  alt={trip.title}
                />
              </div>

              <div className="summary-body">
                <div className="summary-label">
                  Your Trip
                </div>

                <h2 className="summary-title">
                  {trip.title}
                </h2>

                <div className="summary-info">
                  <div className="summary-row">
                    <span className="summary-key">
                      Dates
                    </span>

                    <span className="summary-value">
                      {trip.dates}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-key">
                      Duration
                    </span>

                    <span className="summary-value">
                      {trip.duration}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-key">
                      Location
                    </span>

                    <span className="summary-value">
                      {trip.location}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-key">
                      Availability
                    </span>

                    <span className="summary-value">
                      {trip.availability}
                    </span>
                  </div>
                </div>

                <div className="summary-price">
                  <div>
                    <div className="summary-price-label">
                      Total
                    </div>

                    <div className="summary-price-value">
                      {formatPrice(totalAmount)}
                    </div>

                    <div className="summary-calculation">
                      {breakdown}
                    </div>
                  </div>
                </div>

                <div className="summary-trust">
                  <div className="trust-item">
                    Secure Booking
                  </div>

                  <div className="trust-item">
                    WhatsApp Support
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}