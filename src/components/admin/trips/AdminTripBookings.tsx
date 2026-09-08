import { useEffect, useMemo, useState } from "react";
import "./admin-trip-bookings.css";

const BOOKINGS_STORAGE_KEY = "chatpate_routes_bookings";

type PaymentStatus =
  | "Pending"
  | "Submitted"
  | "Paid"
  | "Failed";

type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed";

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
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadBookings();

    const handleStorageChange = () => {
      loadBookings();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [tripId]);

  function loadBookings() {
    try {
      const stored = JSON.parse(
        localStorage.getItem(BOOKINGS_STORAGE_KEY) || "[]",
      ) as Booking[];

      const tripBookings = stored.filter(
        (booking) =>
          booking.tripSlug === tripId ||
          booking.trip === tripId,
      );

      setBookings(tripBookings);
    } catch (error) {
      console.error("Could not load bookings:", error);
      setBookings([]);
    }
  }

  const stats = useMemo(() => {
    const totalBookings = bookings.length;

    const pendingPayments = bookings.filter(
      (booking) =>
        booking.paymentStatus === "Pending" ||
        booking.paymentStatus === "Submitted",
    ).length;

    const confirmedBookings = bookings.filter(
      (booking) => booking.bookingStatus === "Confirmed",
    ).length;

    const totalRevenue = bookings
      .filter((booking) => booking.paymentStatus === "Paid")
      .reduce(
        (total, booking) => total + Number(booking.advanceAmount || 0),
        0,
      );

    return {
      totalBookings,
      pendingPayments,
      confirmedBookings,
      totalRevenue,
    };
  }, [bookings]);

  function markPaymentSuccessful(bookingId: string) {
    try {
      const stored = JSON.parse(
        localStorage.getItem(BOOKINGS_STORAGE_KEY) || "[]",
      ) as Booking[];

      const updatedBookings = stored.map((booking) =>
        booking.bookingId === bookingId
          ? {
              ...booking,
              paymentStatus: "Paid" as PaymentStatus,
              bookingStatus: "Confirmed" as BookingStatus,
            }
          : booking,
      );

      localStorage.setItem(
        BOOKINGS_STORAGE_KEY,
        JSON.stringify(updatedBookings),
      );

      loadBookings();
    } catch (error) {
      console.error("Could not update booking:", error);
    }
  }

  return (
    <div className="admin-bookings">
      {/* Page heading */}
      <div className="admin-bookings-heading">
        <div>
          <h2>Bookings</h2>
          <p>
            View travellers, payment submissions and booking status
            for this trip.
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-bookings-table-card">
        <div className="admin-bookings-table-header">
          <div>
            <h3>All Bookings</h3>
            <span>
              {bookings.length}{" "}
              {bookings.length === 1 ? "booking" : "bookings"}
            </span>
          </div>
        </div>

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
                bookings.map((booking, index) => (
                  <tr key={booking.bookingId}>
                    <td>
                      <span className="admin-booking-number">
                        {index + 1}
                      </span>
                    </td>

                    <td>
                      <div className="admin-booking-person">
                        <strong>{booking.name}</strong>

                        {booking.travellerNames && (
                          <span>
                            {booking.travellerNames}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className="admin-booking-travellers">
                        {booking.travellers}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {formatPrice(
                          booking.totalAmount ||
                            tripPrice * booking.travellers,
                        )}
                      </strong>
                    </td>

                    <td>
                      <strong className="admin-booking-advance">
                        {formatPrice(
                          booking.advanceAmount ||
                            Math.round(
                              booking.totalAmount * 0.6,
                            ),
                        )}
                      </strong>
                    </td>

                    <td>
                      {booking.paymentScreenshot ? (
                        <a
                          href={booking.paymentScreenshot}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-payment-screenshot"
                        >
                          View Screenshot
                        </a>
                      ) : (
                        <span className="admin-no-screenshot">
                          Not uploaded
                        </span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`admin-payment-badge admin-payment-${booking.paymentStatus.toLowerCase()}`}
                      >
                        <span className="admin-payment-dot" />
                        {booking.paymentStatus}
                      </span>
                    </td>

                    <td>
                      {booking.paymentStatus !== "Paid" &&
                      booking.bookingStatus !== "Confirmed" ? (
                        <button
                          type="button"
                          className="admin-payment-success"
                          onClick={() =>
                            markPaymentSuccessful(
                              booking.bookingId,
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
                ))
              ) : (
                <>
                  {[1, 2, 3, 4].map((row) => (
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