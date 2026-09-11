import { useEffect, useState } from "react";
import "./my-bookings.css";
import { supabase } from "@/integerations/supabase/client";

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

type BackendBooking = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  number_of_people: number;
  booking_date: string | null;
  special_requests: string | null;
  status:
    | "in_progress"
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed";
  payment_status:
    | "pending"
    | "paid"
    | "failed"
    | "refunded";
  payment_id: string | null;
  payment_screenshot_url: string | null;
  total_amount: number | null;
  created_at: string;

  trip?: {
    id: string;
    title: string;
    slug: string;
    destination: string | null;
    duration_days: number | null;
    price: number | null;
    start_date: string | null;
    end_date: string | null;
    cover_image_url: string | null;
  } | null;
};

type Booking = {
  bookingId: string;
  trip: string;
  tripSlug: string;
  tripDate: string;

  name: string;
  whatsapp: string;
  email: string;

  travellers: number;

  totalAmount: number;
  advanceAmount: number;

  notes: string;

  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
};

function formatPrice(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function formatDateRange(
  startDate: string | null,
  endDate: string | null,
) {
  if (!startDate && !endDate) {
    return "Dates to be announced";
  }

  if (startDate && endDate) {
    const start = new Date(startDate).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      },
    );

    const end = new Date(endDate).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );

    return `${start} – ${end}`;
  }

  const date = startDate || endDate;

  if (!date) {
    return "Dates to be announced";
  }

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

function mapBookingStatus(
  status: BackendBooking["status"],
): BookingStatus {
  switch (status) {
    case "confirmed":
      return "Confirmed";

    case "cancelled":
      return "Cancelled";

    case "completed":
      return "Completed";

    case "in_progress":
    case "pending":
    default:
      return "Pending";
  }
}

function mapPaymentStatus(
  status: BackendBooking["payment_status"],
  hasScreenshot: boolean,
): PaymentStatus {
  switch (status) {
    case "paid":
      return "Paid";

    case "failed":
    case "refunded":
      return "Failed";

    case "pending":
    default:
      return hasScreenshot ? "Submitted" : "Pending";
  }
}

function mapBackendBooking(
  booking: BackendBooking,
): Booking {
  const totalAmount = Number(
    booking.total_amount || 0,
  );

  const advanceAmount = Math.round(
    totalAmount * 0.6,
  );

  return {
    bookingId: booking.id,

    trip:
      booking.trip?.title ||
      "Trip",

    tripSlug:
      booking.trip?.slug ||
      "",

    tripDate: formatDateRange(
      booking.trip?.start_date || booking.booking_date,
      booking.trip?.end_date || null,
    ),

    name: booking.full_name,

    whatsapp: booking.phone,

    email: booking.email,

    travellers: booking.number_of_people,

    totalAmount,

    advanceAmount,

    notes:
      booking.special_requests || "",

    paymentStatus: mapPaymentStatus(
      booking.payment_status,
      Boolean(booking.payment_screenshot_url),
    ),

    bookingStatus: mapBookingStatus(
      booking.status,
    ),
  };
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const accessToken =
        session?.access_token ?? null;

      if (!accessToken) {
        setBookings([]);
        setError(
          "Please log in to view your bookings.",
        );
        return;
      }

      const response = await fetch(
        "/api/my-bookings",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Could not load your bookings.",
        );
      }

      const backendBookings =
        Array.isArray(data.bookings)
          ? (data.bookings as BackendBooking[])
          : [];

      const mappedBookings =
        backendBookings.map(mapBackendBooking);

      setBookings(mappedBookings);
    } catch (error) {
      console.error(
        "Could not load bookings:",
        error,
      );

      setBookings([]);

      setError(
        error instanceof Error
          ? error.message
          : "Could not load your bookings.",
      );
    } finally {
      setLoading(false);
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
              View your trips, payment status and
              booking confirmation.
            </p>
          </div>

          <a
            href="/trips"
            className="my-bookings-browse-button"
          >
            Explore Trips
          </a>
        </div>

        {loading ? (
          <section className="my-bookings-empty">
            <div className="my-bookings-empty-icon">
              ✈
            </div>

            <h2>Loading your bookings...</h2>

            <p>
              Please wait while we retrieve your
              bookings.
            </p>
          </section>
        ) : error ? (
          <section className="my-bookings-empty">
            <div className="my-bookings-empty-icon">
              !
            </div>

            <h2>Could not load bookings</h2>

            <p>{error}</p>

           {error === "Please log in to view your bookings." ? (
  <a
    href="/login?redirect=/my-bookings"
    className="my-bookings-empty-button"
  >
    Log In
  </a>
) : (
  <button
    type="button"
    className="my-bookings-empty-button"
    onClick={loadBookings}
  >
    Try Again
  </button>
)}
          </section>
        ) : bookings.length === 0 ? (
          <section className="my-bookings-empty">
            <div className="my-bookings-empty-icon">
              ✈
            </div>

            <h2>No bookings yet</h2>

            <p>
              Your bookings will appear here after
              you complete a booking.
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
                      Your payment has been verified
                      and your spot is confirmed.
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