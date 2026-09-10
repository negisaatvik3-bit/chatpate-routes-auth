import { useEffect, useState } from "react";
import "./my-bookings.css";

const BOOKINGS_STORAGE_KEY = "chatpate_routes_bookings";

type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed";

type PaymentStatus =
  | "Pending"
  | "Submitted"
  | "Paid"
  | "Failed";

type Booking = {
  bookingId: string;
  timestamp: string;

  trip: string;
  tripSlug: string;
  tripDate: string;

  name: string;
  whatsapp: string;
  email: string;

  travellers: number;
  travellerNames: string;

  pricePerPerson: number;
  totalAmount: number;
  advanceAmount: number;

  notes: string;

  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;

  paymentScreenshot?: string;
  paymentScreenshotName?: string;
};

function formatPrice(amount: number) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();

    const handleStorageChange = () => {
      loadBookings();
    };

    window.addEventListener(
      "storage",
      handleStorageChange,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange,
      );
    };
  }, []);

  function loadBookings() {
    try {
      const storedBookings = JSON.parse(
        localStorage.getItem(BOOKINGS_STORAGE_KEY) || "[]",
      );

      setBookings(storedBookings);
    } catch (error) {
      console.error(
        "Could not load bookings:",
        error,
      );

      setBookings([]);
    }
  }

  return (
    <main className="my-bookings-page">
      <div className="my-bookings-container">
        <div className="my-bookings-header">
          <div>
            <p className="my-bookings-eyebrow">
              Traveller Dashboard
            </p>

            <h1>My Bookings</h1>

            <p>
              View your trips, payment status and booking
              confirmation.
            </p>
          </div>

          <a
            href="/trips"
            className="my-bookings-browse-button"
          >
            Explore Trips
          </a>
        </div>

        {bookings.length === 0 ? (
          <section className="my-bookings-empty">
            <div className="my-bookings-empty-icon">
              ✈
            </div>

            <h2>No bookings yet</h2>

            <p>
              Your bookings will appear here after you
              complete a booking.
            </p>

            <a
              href="/trips"
              className="my-bookings-empty-button"
            >
              Explore Trips
            </a>
          </section>
        ) : (
          <section className="my-bookings-list">
            {bookings.map((booking) => (
              <article
                className="my-booking-card"
                key={booking.bookingId}
              >
                <div className="my-booking-card-top">
                  <div>
                    <p className="my-booking-label">
                      Booking
                    </p>

                    <h2>{booking.trip}</h2>

                    <p className="my-booking-reference">
                      {booking.bookingId}
                    </p>
                  </div>

                  <span
                    className={`my-booking-status my-booking-status-${booking.bookingStatus.toLowerCase()}`}
                  >
                    {booking.bookingStatus ===
                    "Confirmed"
                      ? "✓ Booking Confirmed"
                      : booking.bookingStatus}
                  </span>
                </div>

                <div className="my-booking-details">
                  <div className="my-booking-detail">
                    <span>Dates</span>
                    <strong>
                      {booking.tripDate}
                    </strong>
                  </div>

                  <div className="my-booking-detail">
                    <span>Travellers</span>
                    <strong>
                      {booking.travellers}
                    </strong>
                  </div>

                  <div className="my-booking-detail">
                    <span>Total Amount</span>
                    <strong>
                      {formatPrice(
                        booking.totalAmount,
                      )}
                    </strong>
                  </div>

                  <div className="my-booking-detail">
                    <span>Advance Paid</span>
                    <strong>
                      {formatPrice(
                        booking.advanceAmount,
                      )}
                    </strong>
                  </div>
                </div>

                <div className="my-booking-footer">
                  <div>
                    <span className="my-payment-label">
                      Payment
                    </span>

                    <span
                      className={`my-payment-status my-payment-status-${booking.paymentStatus.toLowerCase()}`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>

                  {booking.bookingStatus ===
                    "Confirmed" && (
                    <div className="my-booking-confirmed-message">
                      Your payment has been verified and
                      your spot is confirmed.
                    </div>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}