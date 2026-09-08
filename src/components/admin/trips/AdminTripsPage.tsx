import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import "./admin-trips.css";

type TripStatus = "Published" | "Draft" | "Archived";

type Trip = {
  id: string;
  title: string;
  destination: string;
  dates: string;
  price: number;
  seats: number;
  status: TripStatus;
};

type SavedTrip = {
  id: string;
  status: TripStatus;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  price: string;
  availableSeats: string;
};

const initialTrips: Trip[] = [
  {
    id: "bir-barot-valley",
    title: "Bir × Barot Valley 2.0",
    destination: "Himachal Pradesh",
    dates: "4–6 Sept",
    price: 8999,
    seats: 10,
    status: "Published",
  },
  {
    id: "ghiyagi-jibhi",
    title: "Ghiyagi × Jibhi",
    destination: "Himachal Pradesh",
    dates: "18–20 Sept",
    price: 7499,
    seats: 8,
    status: "Published",
  },
  {
    id: "rishikesh",
    title: "Rishikesh",
    destination: "Uttarakhand",
    dates: "27–28 Sept",
    price: 5999,
    seats: 12,
    status: "Published",
  },
];

export default function AdminTripsPage() {
  const [trips, setTrips] = useState(initialTrips);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TripStatus>("All");

    useEffect(() => {
    const savedTrips = JSON.parse(
      localStorage.getItem("chatpate-admin-trips") || "[]",
    ) as SavedTrip[];

    const formattedTrips: Trip[] = savedTrips.map((trip) => ({
      id: trip.id,
      title: trip.tripName || "Untitled Trip",
      destination: trip.destination || "—",
      dates:
        trip.startDate && trip.endDate
          ? `${trip.startDate} – ${trip.endDate}`
          : "—",
      price: Number(trip.price) || 0,
      seats: Number(trip.availableSeats) || 0,
      status: trip.status || "Draft",
    }));

    setTrips([...initialTrips, ...formattedTrips]);
  }, []);

  const filteredTrips = useMemo(() => {
    const query = search.trim().toLowerCase();

    return trips.filter((trip) => {
      const matchesSearch =
        !query ||
        trip.title.toLowerCase().includes(query) ||
        trip.destination.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || trip.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [trips, search, statusFilter]);

  const togglePublish = (id: string) => {
    setTrips((currentTrips) =>
      currentTrips.map((trip) => {
        if (trip.id !== id) return trip;

        return {
          ...trip,
          status: trip.status === "Published" ? "Draft" : "Published",
        };
      }),
    );
  };

const archiveTrip = (id: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to archive this trip?",
  );

  if (!confirmed) return;

  setTrips((currentTrips) =>
    currentTrips.map((trip) =>
      trip.id === id
        ? {
            ...trip,
            status: "Archived",
          }
        : trip,
    ),
  );

  const savedTrips = JSON.parse(
    localStorage.getItem("chatpate-admin-trips") || "[]",
  ) as SavedTrip[];

  const updatedSavedTrips = savedTrips.map((trip) =>
    trip.id === id
      ? {
          ...trip,
          status: "Archived" as const,
        }
      : trip,
  );

  localStorage.setItem(
    "chatpate-admin-trips",
    JSON.stringify(updatedSavedTrips),
  );
};

  return (
    <main className="admin-trips-page">
      <div className="admin-trips-container">
        <header className="admin-trips-header">
          <div>
            <p className="admin-eyebrow">Admin / Trips</p>

            <h1>Trip Management</h1>

            <p className="admin-subtitle">
              Create, edit and manage all Chatpate Routes trips.
            </p>
          </div>

          <Link to ="/admin/trips/new" className="admin-create-button">
            <span>+</span>
            Create Trip
          </Link>
        </header>

        <section className="admin-toolbar">
          <div className="admin-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search trips or destinations..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-filter">
            <label htmlFor="status-filter">Status</label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "All" | TripStatus,
                )
              }
            >
              <option value="All">All</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </section>

        <section className="admin-table-card">
          <div className="admin-table-header">
            <div>
              <h2>All Trips</h2>
              <span>
                {filteredTrips.length}{" "}
                {filteredTrips.length === 1 ? "trip" : "trips"}
              </span>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-trips-table">
              <thead>
                <tr>
                  <th>Trip</th>
                  <th>Destination</th>
                  <th>Dates</th>
                  <th>Price</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTrips.map((trip) => (
                  <tr key={trip.id}>
                    <td>
                      <div className="admin-trip-name">
                        {trip.title}
                      </div>
                    </td>

                    <td>{trip.destination}</td>

                    <td>{trip.dates}</td>

                    <td className="admin-price">
                      ₹{trip.price.toLocaleString("en-IN")}
                    </td>

                    <td>{trip.seats}</td>

                    <td>
                      <span
                        className={`admin-status admin-status-${trip.status.toLowerCase()}`}
                      >
                        <span className="admin-status-dot" />
                        {trip.status}
                      </span>
                    </td>

                    <td>
                      <div className="admin-actions">
                        <Link
                          to="/trip-detail"
                          className="admin-action admin-action-view"
                        >
                          View
                        </Link>

                        <Link
                          to="/admin/trips/$tripId/edit"
                          params={{ tripId: trip.id }}
                          className="admin-action"
                        >
                          Edit
                        </Link>

                        {trip.status !== "Archived" && (
                          <>
                            <button
                              type="button"
                              className="admin-action"
                              onClick={() => togglePublish(trip.id)}
                            >
                              {trip.status === "Published"
                                ? "Unpublish"
                                : "Publish"}
                            </button>

                            <button
                              type="button"
                              className="admin-action admin-action-danger"
                              onClick={() => archiveTrip(trip.id)}
                            >
                              Archive
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTrips.length === 0 && (
              <div className="admin-empty-state">
                <div className="admin-empty-icon">⌕</div>

                <h3>No trips found</h3>

                <p>
                  Try changing your search or status filter.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}