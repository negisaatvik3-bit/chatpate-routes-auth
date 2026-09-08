import { useEffect, useState } from "react";
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

type TripBooking = {
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

type AdminTripBookingsProps = {
  tripId: string;
  tripPrice: number;
};

function formatPrice(amount: number) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

export default function AdminTripBookings({
  tripId,
  tripPrice,
}: AdminTripBookingsProps) {
  const [bookings, setBookings] = useState<TripBooking[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] =
    useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, [tripId]);

  function loadBookings() {
    try {
      const storedBookings = JSON.parse(
        localStorage.getItem(BOOKINGS_STORAGE_KEY) || "[]",
      );

      const tripBookings = storedBookings.filter(
        (booking: TripBooking) =>
          booking.tripSlug === tripId ||
          booking.tripSlug === "bir-barot-valley",
      );

      setBookings(tripBookings);
    } catch (error) {
      console.error("Could not load bookings:", error);
      setBookings([]);
    }
  }

  function markPaymentSuccessful(bookingId: string) {
    const storedBookings: TripBooking[] = JSON.parse(
      localStorage.getItem(BOOKINGS_STORAGE_KEY) || "[]",
    );

    const updatedBookings = storedBookings.map((booking) => {
      if (booking.bookingId !== bookingId) {
        return booking;
      }

      return {
        ...booking,
        paymentStatus: "Paid" as PaymentStatus,
        bookingStatus: "Confirmed" as BookingStatus,
      };
    });

    localStorage.setItem(
      BOOKINGS_STORAGE_KEY,
      JSON.stringify(updatedBookings),
    );

    setBookings(
      updatedBookings.filter(
        (booking) =>
          booking.tripSlug === tripId ||
          booking.tripSlug === "bir-barot-valley",
      ),
    );
  }

  return (
    <>
      <div className="admin-bookings-header">
        <div>
          <h2>Bookings</h2>

          <p>
            View travellers, payment submissions and booking
            status for this trip.
          </p>
        </div>

        <span className="admin-bookings-count">
          {bookings.length}{" "}
          {bookings.length === 1 ? "booking" : "bookings"}
        </span>
      </div>

      <div className="admin-bookings-info">
        <strong>Payment verification:</strong>{" "}
        Verify the payment with the traveller through WhatsApp,
        then use <strong>Payment Successful</strong> to confirm
        the booking.
      </div>

      {bookings.length === 0 ? (
        <div className="admin-bookings-empty">
          <div className="admin-bookings-empty-icon">
            ✓
          </div>

          <h3>No bookings yet</h3>

          <p>
            Bookings submitted by travellers for this trip
            will appear here.
          </p>
        </div>
      ) : (
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
                <th>Booking Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.bookingId}>
                  {/* NUMBER */}
                  <td>
                    <div className="admin-booking-number">
                      {index + 1}
                    </div>
                  </td>

                  {/* NAME */}
                  <td>
                    <div className="admin-booking-name">
                      <strong>{booking.name}</strong>

                      <span>
                        {booking.bookingId}
                      </span>

                      {booking.travellerNames && (
                        <small>
                          {booking.travellerNames}
                        </small>
                      )}
                    </div>
                  </td>

                  {/* TRAVELLERS */}
                  <td>
                    <span className="admin-traveller-count">
                      {booking.travellers}
                    </span>
                  </td>

                  {/* TOTAL */}
                  <td className="admin-booking-total">
                    {formatPrice(booking.totalAmount)}
                  </td>

                  {/* ADVANCE */}
                  <td className="admin-booking-advance">
                    {formatPrice(
                      booking.advanceAmount ||
                        Math.round(
                          booking.totalAmount * 0.6,
                        ),
                    )}
                  </td>

                  {/* SCREENSHOT */}
                  <td>
                    {booking.paymentScreenshot ? (
                      <button
                        type="button"
                        className="admin-screenshot-button"
                        onClick={() =>
                          setSelectedScreenshot(
                            booking.paymentScreenshot!,
                          )
                        }
                      >
                        View Screenshot
                      </button>
                    ) : (
                      <span className="admin-no-screenshot">
                        Not submitted
                      </span>
                    )}
                  </td>

                  {/* PAYMENT STATUS */}
                  <td>
                    <span
                      className={`admin-payment-status admin-payment-status-${booking.paymentStatus.toLowerCase()}`}
                    >
                      <span className="admin-payment-status-dot" />

                      {booking.paymentStatus}
                    </span>
                  </td>

                  {/* BOOKING STATUS */}
                  <td>
                    <span
                      className={`admin-booking-status admin-booking-status-${booking.bookingStatus.toLowerCase()}`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td>
                    {booking.bookingStatus === "Confirmed" ? (
                      <span className="admin-confirmed-label">
                        ✓ Confirmed
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="admin-payment-success-button"
                        onClick={() =>
                          markPaymentSuccessful(
                            booking.bookingId,
                          )
                        }
                      >
                        Payment Successful
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREENSHOT MODAL */}

      {selectedScreenshot && (
        <div
          className="admin-screenshot-modal"
          onClick={() =>
            setSelectedScreenshot(null)
          }
        >
          <div
            className="admin-screenshot-modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="admin-screenshot-close"
              onClick={() =>
                setSelectedScreenshot(null)
              }
            >
              ×
            </button>

            <img
              src={selectedScreenshot}
              alt="Payment screenshot"
            />
          </div>
        </div>
      )}
    </>
  );
}