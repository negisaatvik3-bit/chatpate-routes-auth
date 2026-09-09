import { useEffect, useState } from "react";
import "./admin-trip-bookings.css";
import { supabase } from "@/integerations/supabase/client";

type BackendBooking = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  number_of_people: number;
  booking_date: string;
  special_requests: string | null;
  status: "in_progress" | "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  total_amount: number | null;
  created_at: string;

  trip?: {
    id: string;
    title: string;
    slug: string;
    destination: string;
    start_date: string;
    end_date: string;
    price: number | null;
  } | null;
};

type Props = {
  tripId: string;
  tripPrice?: number;
};

function formatPrice(amount: number) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export default function AdminTripBookings({
  tripId,
  tripPrice = 8999,
}: Props) {
  const [bookings, setBookings] = useState<BackendBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBookings();
  }, [tripId]);

  async function getAccessToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token ?? null;
  }

  async function loadBookings() {
    setLoading(true);
    setError("");

    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        setError("You must be logged in as an administrator.");
        setBookings([]);
        return;
      }

      const response = await fetch("/api/admin/bookings", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Could not retrieve bookings.",
        );
      }

      const allBookings = (data.bookings ?? []) as BackendBooking[];

      const tripBookings = allBookings.filter(
        (booking) =>
          booking.trip?.id === tripId ||
          booking.trip?.slug === tripId,
      );

      setBookings(tripBookings);
    } catch (error) {
      console.error("Could not load bookings:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Could not load bookings.",
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  async function markPaymentSuccessful(bookingId: string) {
    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        window.alert("You must be logged in as an administrator.");
        return;
      }

      const response = await fetch(
        `/api/admin/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            payment_status: "paid",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Could not update booking.",
        );
      }

      await loadBookings();
    } catch (error) {
      console.error("Could not update booking:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not update booking.",
      );
    }
  }

  const totalBookings = bookings.length;

  const pendingPayments = bookings.filter(
    (booking) => booking.payment_status === "pending",
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed",
  ).length;

  const advanceCollected = bookings
    .filter((booking) => booking.payment_status === "paid")
    .reduce(
      (total, booking) =>
        total + Math.round(Number(booking.total_amount || 0) * 0.6),
      0,
    );

  return (
    <div className="admin-bookings">
      {/* Page heading */}
      <div className="admin-bookings-heading">
        <div>
          <h2>Bookings</h2>

          <p>
            View travellers, payment submissions and booking
            status for this trip.
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-bookings-table-card">
        <div className="admin-bookings-table-header">
          <div>
            <h3>All Bookings</h3>

            <span>
              {loading
                ? "Loading..."
                : `${bookings.length} ${
                    bookings.length === 1
                      ? "booking"
                      : "bookings"
                  }`}
            </span>
          </div>
        </div>

        {error && (
          <div className="admin-bookings-error">
            {error}
          </div>
        )}

        <div className="admin-bookings-table-wrapper">
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>No. of Travellers</th>
                <th>Total Trip Amount</th>
                <th>Advance to Pay</th>
                <th>Payment Screenshot</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking, index) => {
                  const totalAmount =
                    Number(booking.total_amount) ||
                    tripPrice * booking.number_of_people;

                  const advanceAmount = Math.round(
                    totalAmount * 0.6,
                  );

                  return (
                    <tr key={booking.id}>
                      <td>
                        <span className="admin-booking-number">
                          {index + 1}
                        </span>
                      </td>

                      <td>
                        <div className="admin-booking-person">
                          <strong>{booking.full_name}</strong>

                          <span>{booking.email}</span>
                        </div>
                      </td>

                      <td>
                        <span className="admin-booking-travellers">
                          {booking.number_of_people}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {formatPrice(totalAmount)}
                        </strong>
                      </td>

                      <td>
                        <strong className="admin-booking-advance">
                          {formatPrice(advanceAmount)}
                        </strong>
                      </td>

                      <td>
                        <span className="admin-no-screenshot">
                          Backend upload not connected
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-payment-badge admin-payment-${booking.payment_status}`}
                        >
                          <span className="admin-payment-dot" />

                          {booking.payment_status}
                        </span>
                      </td>

                      <td>
                        {booking.payment_status !== "paid" &&
                        booking.status !== "confirmed" ? (
                          <button
                            type="button"
                            className="admin-payment-success"
                            onClick={() =>
                              markPaymentSuccessful(
                                booking.id,
                              )
                            }
                          >
                            Payment Successful
                          </button>
                        ) : (
                          <span className="admin-confirmed-label">
                            ✓ Confirmed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <>
                  {!loading &&
                    [1, 2, 3, 4].map((row) => (
                      <tr
                        key={`empty-booking-row-${row}`}
                        className="admin-empty-booking-row"
                      >
                        <td>
                          <span className="admin-empty-line short" />
                        </td>

                        <td>
                          <span className="admin-empty-line" />
                        </td>

                        <td>
                          <span className="admin-empty-line short" />
                        </td>

                        <td>
                          <span className="admin-empty-line" />
                        </td>

                        <td>
                          <span className="admin-empty-line" />
                        </td>

                        <td>
                          <span className="admin-empty-line" />
                        </td>

                        <td>
                          <span className="admin-empty-line medium" />
                        </td>

                        <td>
                          <span className="admin-empty-line medium" />
                        </td>
                      </tr>
                    ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}