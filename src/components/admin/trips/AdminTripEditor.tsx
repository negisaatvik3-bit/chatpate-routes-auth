import { useEffect, useState } from "react";
import "./admin-trip-editor.css";
import AdminTripBookings from "./AdminTripBookings";

type Section =
  | "overview"
  | "itinerary"
  | "stay"
  | "included"
  | "packing"
  | "rules"
  | "faq"
  | "bookings";

type ItineraryDay = {
  day: number;
  title: string;
  description: string;
};

type FAQ = {
  question: string;
  answer: string;
};

type AdminTripEditorProps = {
  tripId: string;
};

type SavedTrip = {
  id: string;
  status: "Draft" | "Published" | "Archived";

  tripName: string;
  destination: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;

  startDate: string;
  endDate: string;
  duration: string;
  price: string;
  capacity: string;
  availableSeats: string;

  tripType: string;
  coverImage: string;
  gallery: string;

  host: string;
  pickupPoint: string;
  suitableFor: string;

  itinerary: ItineraryDay[];

  accommodation: string;
  accommodationDescription: string;
  stayLocation: string;
  groupSize: string;

  included: string[];
  notIncluded: string[];
  packingItems: string[];
  rules: string[];

  faqs: FAQ[];

  cancellationPolicy: string;
};

type AdminBooking = {
  bookingId: string;
  tripSlug: string;
  travellers: number;
  totalAmount: number;
  advanceAmount: number;
  paymentStatus: "Pending" | "Submitted" | "Paid" | "Failed";
  bookingStatus:
    | "Pending"
    | "Confirmed"
    | "Cancelled"
    | "Completed";
};

const sections: { id: Section; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "stay", label: "Stay" },
  { id: "included", label: "Included" },
  { id: "packing", label: "What to Bring" },
  { id: "rules", label: "Rules" },
  { id: "faq", label: "FAQ" },
  { id: "bookings", label: "Bookings" },
];

export default function AdminTripEditor({
  tripId,
}: AdminTripEditorProps) {
  const [activeSection, setActiveSection] =
    useState<Section>("overview");
  const [adminBookings, setAdminBookings] = useState<AdminBooking[]>([]);

  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");

  const [tripType, setTripType] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [gallery, setGallery] = useState("");

  const [host, setHost] = useState("");
  const [pickupPoint, setPickupPoint] = useState("");
  const [suitableFor, setSuitableFor] = useState("");

  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    {
      day: 1,
      title: "",
      description: "",
    },
  ]);

  const [accommodation, setAccommodation] = useState("");
  const [accommodationDescription, setAccommodationDescription] =
    useState("");
  const [stayLocation, setStayLocation] = useState("");
  const [groupSize, setGroupSize] = useState("");

  const [included, setIncluded] = useState<string[]>([""]);
  const [notIncluded, setNotIncluded] = useState<string[]>([""]);

  const [packingItems, setPackingItems] = useState<string[]>([""]);

  const [rules, setRules] = useState<string[]>([""]);

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      question: "",
      answer: "",
    },
  ]);

  const [cancellationPolicy, setCancellationPolicy] = useState("");

  useEffect(() => {
  if (tripId === "new") return;

  const savedTrips = JSON.parse(
    localStorage.getItem("chatpate-admin-trips") || "[]",
  ) as SavedTrip[];

  const savedTrip = savedTrips.find((trip) => trip.id === tripId);

  if (!savedTrip) return;

  setTripName(savedTrip.tripName);
  setDestination(savedTrip.destination);
  setSlug(savedTrip.slug);
  setShortDescription(savedTrip.shortDescription);
  setDetailedDescription(savedTrip.detailedDescription);

  setStartDate(savedTrip.startDate);
  setEndDate(savedTrip.endDate);
  setDuration(savedTrip.duration);
  setPrice(savedTrip.price);
  setCapacity(savedTrip.capacity);
  setAvailableSeats(savedTrip.availableSeats);

  setTripType(savedTrip.tripType);
  setCoverImage(savedTrip.coverImage);
  setGallery(savedTrip.gallery);

  setHost(savedTrip.host);
  setPickupPoint(savedTrip.pickupPoint);
  setSuitableFor(savedTrip.suitableFor);

  setItinerary(savedTrip.itinerary);

  setAccommodation(savedTrip.accommodation);
  setAccommodationDescription(savedTrip.accommodationDescription);
  setStayLocation(savedTrip.stayLocation);
  setGroupSize(savedTrip.groupSize);

  setIncluded(savedTrip.included);
  setNotIncluded(savedTrip.notIncluded);
  setPackingItems(savedTrip.packingItems);
  setRules(savedTrip.rules);

  setFaqs(savedTrip.faqs);

  setCancellationPolicy(savedTrip.cancellationPolicy);
}, [tripId]);

useEffect(() => {
  const loadBookings = () => {
    try {
      const storedBookings = JSON.parse(
        localStorage.getItem("chatpate_routes_bookings") || "[]",
      ) as AdminBooking[];

      const tripBookings = storedBookings.filter(
        (booking) =>
          booking.tripSlug === tripId ||
          booking.tripSlug === slug,
      );

      setAdminBookings(tripBookings);
    } catch (error) {
      console.error("Could not load bookings:", error);
      setAdminBookings([]);
    }
  };

  loadBookings();

  window.addEventListener("storage", loadBookings);

  return () => {
    window.removeEventListener("storage", loadBookings);
  };
}, [tripId, slug]);

  const addItineraryDay = () => {
    setItinerary((current) => [
      ...current,
      {
        day: current.length + 1,
        title: "",
        description: "",
      },
    ]);
  };

  const removeItineraryDay = (index: number) => {
    if (itinerary.length === 1) return;

    setItinerary((current) =>
      current
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({
          ...item,
          day: itemIndex + 1,
        })),
    );
  };

  const updateItinerary = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    setItinerary((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const addIncluded = () => {
    setIncluded((current) => [...current, ""]);
  };

  const removeIncluded = (index: number) => {
    if (included.length === 1) return;

    setIncluded((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const updateIncluded = (index: number, value: string) => {
    setIncluded((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    );
  };

  const addNotIncluded = () => {
    setNotIncluded((current) => [...current, ""]);
  };

  const removeNotIncluded = (index: number) => {
    if (notIncluded.length === 1) return;

    setNotIncluded((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const updateNotIncluded = (index: number, value: string) => {
    setNotIncluded((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    );
  };

  const addPackingItem = () => {
    if (packingItems.length >= 9) return;

    setPackingItems((current) => [...current, ""]);
  };

  const removePackingItem = (index: number) => {
    if (packingItems.length === 1) return;

    setPackingItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const updatePackingItem = (index: number, value: string) => {
    setPackingItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    );
  };

  const addRule = () => {
    setRules((current) => [...current, ""]);
  };

  const removeRule = (index: number) => {
    if (rules.length === 1) return;

    setRules((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const updateRule = (index: number, value: string) => {
    setRules((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    );
  };

  const addFAQ = () => {
    setFaqs((current) => [
      ...current,
      {
        question: "",
        answer: "",
      },
    ]);
  };

  const removeFAQ = (index: number) => {
    if (faqs.length === 1) return;

    setFaqs((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const updateFAQ = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    setFaqs((current) =>
      current.map((faq, itemIndex) =>
        itemIndex === index
          ? {
              ...faq,
              [field]: value,
            }
          : faq,
      ),
    );
  };


  const validateTrip = () => {
  const missing: string[] = [];

  if (!tripName.trim()) missing.push("Trip Name");
  if (!destination.trim()) missing.push("Destination");
  if (!slug.trim()) missing.push("Slug");
  if (!shortDescription.trim()) missing.push("Short Description");
  if (!detailedDescription.trim()) {
    missing.push("Detailed Description");
  }

  if (!startDate) missing.push("Start Date");
  if (!endDate) missing.push("End Date");
  if (!duration.trim()) missing.push("Duration");
  if (!price.trim()) missing.push("Price");
  if (!capacity.trim()) missing.push("Capacity");
  if (!availableSeats.trim()) {
    missing.push("Available Seats");
  }

  if (!tripType.trim()) missing.push("Trip Type");
  if (!coverImage.trim()) missing.push("Cover Image");
  if (!host.trim()) missing.push("Host");
  if (!pickupPoint.trim()) {
    missing.push("Pickup Point");
  }

  if (!accommodation.trim()) {
    missing.push("Accommodation");
  }

  if (!cancellationPolicy.trim()) {
    missing.push("Cancellation Policy");
  }

  const hasValidItinerary =
    itinerary.length > 0 &&
    itinerary.every(
      (day) =>
        day.title.trim() &&
        day.description.trim(),
    );

  if (!hasValidItinerary) {
    missing.push("Complete Itinerary");
  }

  const hasIncludedItems =
    included.length > 0 &&
    included.some((item) => item.trim());

  if (!hasIncludedItems) {
    missing.push("What's Included");
  }

  const hasNotIncludedItems =
    notIncluded.length > 0 &&
    notIncluded.some((item) => item.trim());

  if (!hasNotIncludedItems) {
    missing.push("What's Not Included");
  }

  const hasPackingItems =
    packingItems.length > 0 &&
    packingItems.some((item) => item.trim());

  if (!hasPackingItems) {
    missing.push("What to Bring");
  }

  const hasRules =
    rules.length > 0 &&
    rules.some((rule) => rule.trim());

  if (!hasRules) {
    missing.push("Rules");
  }

  const hasFAQs =
    faqs.length > 0 &&
    faqs.every(
      (faq) =>
        faq.question.trim() &&
        faq.answer.trim(),
    );

  if (!hasFAQs) {
    missing.push("FAQ");
  }

  return missing;
};

const missingFields = validateTrip();
const canPublish = missingFields.length === 0;

  const saveDraft = () => {
  const id =
    tripId === "new"
      ? `trip-${Date.now()}`
      : tripId;

  const newTrip: SavedTrip = {
    id,
    status: "Draft",

    tripName,
    destination,
    slug,
    shortDescription,
    detailedDescription,

    startDate,
    endDate,
    duration,
    price,
    capacity,
    availableSeats,

    tripType,
    coverImage,
    gallery,

    host,
    pickupPoint,
    suitableFor,

    itinerary,

    accommodation,
    accommodationDescription,
    stayLocation,
    groupSize,

    included,
    notIncluded,
    packingItems,
    rules,

    faqs,

    cancellationPolicy,
  };

  const existingTrips = JSON.parse(
    localStorage.getItem("chatpate-admin-trips") || "[]",
  ) as SavedTrip[];

  const tripExists = existingTrips.some(
    (trip) => trip.id === id,
  );

  const updatedTrips = tripExists
    ? existingTrips.map((trip) =>
        trip.id === id ? newTrip : trip,
      )
    : [...existingTrips, newTrip];

  localStorage.setItem(
    "chatpate-admin-trips",
    JSON.stringify(updatedTrips),
  );

  alert("Draft saved successfully.");
};

const publishTrip = () => {
  const missing = validateTrip();

  if (missing.length > 0) {
    alert(
      `Please complete the following before publishing:\n\n• ${missing.join(
        "\n• ",
      )}`,
    );
    return;
  }

  const id =
    tripId === "new"
      ? `trip-${Date.now()}`
      : tripId;

  const savedTrips = JSON.parse(
    localStorage.getItem("chatpate-admin-trips") || "[]",
  ) as SavedTrip[];

  const updatedTrips = savedTrips.map((trip) =>
    trip.id === id
      ? {
          ...trip,
          status: "Published" as const,
        }
      : trip,
  );

  localStorage.setItem(
    "chatpate-admin-trips",
    JSON.stringify(updatedTrips),
  );

  alert("Trip published successfully.");
};

const totalBookings = adminBookings.length;

const pendingPayments = adminBookings.filter(
  (booking) =>
    booking.paymentStatus === "Pending" ||
    booking.paymentStatus === "Submitted",
).length;

const confirmedBookings = adminBookings.filter(
  (booking) => booking.bookingStatus === "Confirmed",
).length;

const advanceCollected = adminBookings
  .filter((booking) => booking.paymentStatus === "Paid")
  .reduce(
    (total, booking) =>
      total + Number(booking.advanceAmount || 0),
    0,
  );

  return (
    <main className="admin-trip-editor-page">
      <div className="admin-trip-editor-container">

        {/* HEADER */}

        <header className="admin-editor-header">
  <div>
    <div className="admin-breadcrumb-row">
      <p className="admin-eyebrow">
        Admin / Trips / Edit
      </p>

      <button
        type="button"
        className="admin-back-button"
        onClick={() => window.history.back()}
      >
        ← Back to Trips
      </button>
    </div>

    <div className="admin-editor-title-row">
      <div>
        <h1>
          {tripName || "Create Trip"}
        </h1>
      </div>

      <span className="admin-editor-status">
        Draft
      </span>
    </div>
  </div>

          <div className="admin-editor-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={saveDraft}
            >
              Save Draft
            </button>

            <button
                type="button"
                className="admin-primary-button"
                onClick={publishTrip}
                disabled={!canPublish}
                title={
                    canPublish
                    ? "Publish this trip"
                    : "Complete all required fields before publishing"
                }
                >
                Publish Trip
            </button>
          </div>
        </header>

        {/* EDITOR */}

        {/* EDITOR */}

{activeSection === "bookings" && (
  <div className="admin-bookings-top-stats">
    <div className="admin-booking-stat-card">
      <div className="admin-booking-stat-content">
        <span className="admin-booking-stat-label">
          Total Bookings
        </span>

        <strong className="admin-booking-stat-value">
          {totalBookings}
        </strong>
      </div>

      <div className="admin-booking-stat-icon">
        #
      </div>
    </div>

    <div className="admin-booking-stat-card">
      <div className="admin-booking-stat-content">
        <span className="admin-booking-stat-label">
          Pending Payments
        </span>

        <strong className="admin-booking-stat-value">
          {pendingPayments}
        </strong>
      </div>

      <div className="admin-booking-stat-icon">
        ₹
      </div>
    </div>

    <div className="admin-booking-stat-card">
      <div className="admin-booking-stat-content">
        <span className="admin-booking-stat-label">
          Confirmed Bookings
        </span>

        <strong className="admin-booking-stat-value">
          {confirmedBookings}
        </strong>
      </div>

      <div className="admin-booking-stat-icon">
        ✓
      </div>
    </div>

    <div className="admin-booking-stat-card">
      <div className="admin-booking-stat-content">
        <span className="admin-booking-stat-label">
          Advance Collected
        </span>

        <strong className="admin-booking-stat-value">
          ₹{advanceCollected.toLocaleString("en-IN")}
        </strong>
      </div>

      <div className="admin-booking-stat-icon">
        ₹
      </div>
    </div>
  </div>
)}

<section className="admin-editor-card">

          {/* LEFT NAVIGATION */}

          <aside className="admin-editor-sidebar">
            <div className="admin-sidebar-title">
              Trip Sections
            </div>

            <nav className="admin-section-nav">
              {sections.map((section) => {
  const sectionMissing =
    section.id === "overview"
      ? missingFields.some((field) =>
          [
            "Trip Name",
            "Destination",
            "Slug",
            "Short Description",
            "Detailed Description",
            "Start Date",
            "End Date",
            "Duration",
            "Price",
            "Capacity",
            "Available Seats",
            "Trip Type",
            "Cover Image",
            "Host",
            "Pickup Point",
            "Cancellation Policy",
          ].includes(field),
        )
      : section.id === "itinerary"
        ? missingFields.includes("Complete Itinerary")
        : section.id === "stay"
          ? missingFields.includes("Accommodation")
          : section.id === "included"
            ? missingFields.includes("What's Included") ||
              missingFields.includes("What's Not Included")
            : section.id === "packing"
              ? missingFields.includes("What to Bring")
              : section.id === "rules"
                ? missingFields.includes("Rules")
                : missingFields.includes("FAQ");

                return (
                    <button
                    key={section.id}
                    type="button"
                    className={`admin-section-nav-item ${
                        activeSection === section.id ? "active" : ""
                    }`}
                    onClick={() => setActiveSection(section.id)}
                    >
                    <span>{section.label}</span>

                    <span
                        className={
                        sectionMissing
                            ? "admin-section-status incomplete"
                            : "admin-section-status complete"
                        }
                    >
                        {sectionMissing ? "!" : "✓"}
                    </span>
                    </button>
                );
                })}
            </nav>
          </aside>

          {/* RIGHT CONTENT */}

          <div className="admin-editor-content">

            {/* OVERVIEW */}

            {activeSection === "overview" && (
              <section className="admin-form-section">
                <div className="admin-form-heading">
                  <h2>Overview</h2>
                  <p>
                    Add the basic information and main details
                    of the trip.
                  </p>
                </div>

                <div className="admin-form-grid">

                  <div className="admin-form-field full">
                    <label>Trip Name *</label>
                    <input
                      value={tripName}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTripName(value);

                        setSlug(
                            value
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9\s-]/g, "")
                            .replace(/\s+/g, "-")
                            .replace(/-+/g, "-"),
                        );
                        }}
                      placeholder="e.g. Bir × Barot Valley 2.0"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Destination *</label>
                    <input
                      value={destination}
                      onChange={(e) =>
                        setDestination(e.target.value)
                      }
                      placeholder="e.g. Himachal Pradesh"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Trip Type</label>
                    <input
                      value={tripType}
                      onChange={(e) =>
                        setTripType(e.target.value)
                      }
                      placeholder="e.g. Adventure"
                    />
                  </div>

                  <div className="admin-form-field full">
                    <label>Slug</label>
                    <input
                    value={slug}
                    readOnly
                    placeholder="Auto-generated from trip name"
                    />
                    <small>
                        Automatically generated from the trip name.
                    </small>
                  </div>

                  <div className="admin-form-field full">
                    <label>Short Description *</label>
                    <textarea
                      value={shortDescription}
                      onChange={(e) =>
                        setShortDescription(e.target.value)
                      }
                      rows={3}
                      placeholder="Short description shown in trip cards..."
                    />
                  </div>

                  <div className="admin-form-field full">
                    <label>Detailed Description *</label>
                    <textarea
                      value={detailedDescription}
                      onChange={(e) =>
                        setDetailedDescription(e.target.value)
                      }
                      rows={6}
                      placeholder="Detailed overview of the trip..."
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) =>
                        setStartDate(e.target.value)
                      }
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>End Date *</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) =>
                        setEndDate(e.target.value)
                      }
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Duration *</label>
                    <input
                      value={duration}
                      onChange={(e) =>
                        setDuration(e.target.value)
                      }
                      placeholder="e.g. 3 Days / 2 Nights"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Price *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value)
                      }
                      placeholder="8999"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Capacity *</label>
                    <input
                      type="number"
                      value={capacity}
                      onChange={(e) =>
                        setCapacity(e.target.value)
                      }
                      placeholder="15"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Available Seats *</label>
                    <input
                      type="number"
                      value={availableSeats}
                      onChange={(e) =>
                        setAvailableSeats(e.target.value)
                      }
                      placeholder="15"
                    />
                  </div>

                  <div className="admin-form-field full">
                    <label>Cover Image *</label>
                    <input
                      value={coverImage}
                      onChange={(e) =>
                        setCoverImage(e.target.value)
                      }
                      placeholder="Image URL"
                    />
                  </div>

                  <div className="admin-form-field full">
                    <label>Gallery</label>
                    <textarea
                      value={gallery}
                      onChange={(e) =>
                        setGallery(e.target.value)
                      }
                      rows={3}
                      placeholder="Add image URLs separated by commas..."
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Host *</label>
                    <input
                      value={host}
                      onChange={(e) =>
                        setHost(e.target.value)
                      }
                      placeholder="Host name"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Pickup Point *</label>
                    <input
                      value={pickupPoint}
                      onChange={(e) =>
                        setPickupPoint(e.target.value)
                      }
                      placeholder="Pickup location"
                    />
                  </div>

                  <div className="admin-form-field full">
                    <label>Who is this trip suitable for?</label>
                    <textarea
                      value={suitableFor}
                      onChange={(e) =>
                        setSuitableFor(e.target.value)
                      }
                      rows={4}
                      placeholder="Describe who this trip is suitable for..."
                    />
                  </div>

                  <div className="admin-form-field full">
                    <label>Cancellation Policy *</label>
                    <textarea
                      value={cancellationPolicy}
                      onChange={(e) =>
                        setCancellationPolicy(e.target.value)
                      }
                      rows={5}
                      placeholder="Enter the cancellation policy..."
                    />
                  </div>

                </div>
              </section>
            )}

            {/* ITINERARY */}

            {activeSection === "itinerary" && (
              <section className="admin-form-section">
                <div className="admin-form-heading">
                  <h2>Itinerary</h2>
                  <p>
                    Build the trip day by day.
                  </p>
                </div>

                <div className="admin-repeatable-list">
                  {itinerary.map((day, index) => (
                    <div
                      className="admin-repeatable-card"
                      key={index}
                    >
                      <div className="admin-repeatable-header">
                        <h3>Day {day.day}</h3>

                        <button
                          type="button"
                          className="admin-remove-button"
                          onClick={() =>
                            removeItineraryDay(index)
                          }
                        >
                          Remove
                        </button>
                      </div>

                      <div className="admin-form-field">
                        <label>Day Title *</label>
                        <input
                          value={day.title}
                          onChange={(e) =>
                            updateItinerary(
                              index,
                              "title",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Arrival & Local Exploration"
                        />
                      </div>

                      <div className="admin-form-field">
                        <label>Description *</label>
                        <textarea
                          value={day.description}
                          onChange={(e) =>
                            updateItinerary(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          rows={5}
                          placeholder="Describe activities for this day..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="admin-add-button"
                  onClick={addItineraryDay}
                >
                  + Add Day
                </button>
              </section>
            )}

            {/* STAY */}

            {activeSection === "stay" && (
              <section className="admin-form-section">
                <div className="admin-form-heading">
                  <h2>Stay</h2>
                  <p>
                    Add accommodation and stay information.
                  </p>
                </div>

                <div className="admin-form-grid">

                  <div className="admin-form-field full">
                    <label>Accommodation *</label>
                    <input
                      value={accommodation}
                      onChange={(e) =>
                        setAccommodation(e.target.value)
                      }
                      placeholder="e.g. Mountain View Homestay"
                    />
                  </div>

                  <div className="admin-form-field full">
                    <label>Accommodation Description</label>
                    <textarea
                      value={accommodationDescription}
                      onChange={(e) =>
                        setAccommodationDescription(
                          e.target.value,
                        )
                      }
                      rows={5}
                      placeholder="Describe the accommodation..."
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Stay Location</label>
                    <input
                      value={stayLocation}
                      onChange={(e) =>
                        setStayLocation(e.target.value)
                      }
                      placeholder="Location"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Group Size</label>
                    <input
                      value={groupSize}
                      onChange={(e) =>
                        setGroupSize(e.target.value)
                      }
                      placeholder="e.g. 10–15 people"
                    />
                  </div>

                </div>
              </section>
            )}

            {/* INCLUDED */}

            {activeSection === "included" && (
              <section className="admin-form-section">
                <div className="admin-form-heading">
                  <h2>Included</h2>
                  <p>
                    Specify what is and isn't included in the
                    trip price.
                  </p>
                </div>

                <div className="admin-list-section">
                  <h3>What's Included *</h3>

                  {included.map((item, index) => (
                    <div
                      className="admin-list-input"
                      key={index}
                    >
                      <input
                        value={item}
                        onChange={(e) =>
                          updateIncluded(
                            index,
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Accommodation"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeIncluded(index)
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="admin-add-button"
                    onClick={addIncluded}
                  >
                    + Add Inclusion
                  </button>
                </div>

                <div className="admin-list-section">
                  <h3>What's Not Included *</h3>

                  {notIncluded.map((item, index) => (
                    <div
                      className="admin-list-input"
                      key={index}
                    >
                      <input
                        value={item}
                        onChange={(e) =>
                          updateNotIncluded(
                            index,
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Personal expenses"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeNotIncluded(index)
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="admin-add-button"
                    onClick={addNotIncluded}
                  >
                    + Add Exclusion
                  </button>
                </div>
              </section>
            )}

            {/* WHAT TO BRING */}

            {activeSection === "packing" && (
              <section className="admin-form-section">
                <div className="admin-form-heading">
                  <div className="admin-heading-with-counter">
                    <div>
                      <h2>What to Bring</h2>
                      <p>
                        Add the things travellers should bring.
                      </p>
                    </div>

                    <span className="admin-counter">
                      {packingItems.length} / 9
                    </span>
                  </div>
                </div>

                <div className="admin-list-section">

                  {packingItems.map((item, index) => (
                    <div
                      className="admin-list-input"
                      key={index}
                    >
                      <span className="admin-list-number">
                        {index + 1}
                      </span>

                      <input
                        value={item}
                        onChange={(e) =>
                          updatePackingItem(
                            index,
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Comfortable shoes"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removePackingItem(index)
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="admin-add-button"
                    onClick={addPackingItem}
                    disabled={packingItems.length >= 9}
                  >
                    + Add Item
                  </button>

                </div>
              </section>
            )}

            {/* RULES */}

            {activeSection === "rules" && (
              <section className="admin-form-section">
                <div className="admin-form-heading">
                  <h2>Rules</h2>
                  <p>
                    Add rules and guidelines travellers need
                    to follow.
                  </p>
                </div>

                <div className="admin-list-section">

                  {rules.map((rule, index) => (
                    <div
                      className="admin-list-input"
                      key={index}
                    >
                      <span className="admin-list-number">
                        {index + 1}
                      </span>

                      <input
                        value={rule}
                        onChange={(e) =>
                          updateRule(
                            index,
                            e.target.value,
                          )
                        }
                        placeholder="Enter trip rule..."
                      />

                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="admin-add-button"
                    onClick={addRule}
                  >
                    + Add Rule
                  </button>

                </div>
              </section>
            )}

            {/* FAQ */}

            {activeSection === "faq" && (
              <section className="admin-form-section">
                <div className="admin-form-heading">
                  <h2>FAQ</h2>
                  <p>
                    Add frequently asked questions about the
                    trip.
                  </p>
                </div>

                <div className="admin-repeatable-list">

                  {faqs.map((faq, index) => (
                    <div
                      className="admin-repeatable-card"
                      key={index}
                    >
                      <div className="admin-repeatable-header">
                        <h3>Question {index + 1}</h3>

                        <button
                          type="button"
                          className="admin-remove-button"
                          onClick={() =>
                            removeFAQ(index)
                          }
                        >
                          Remove
                        </button>
                      </div>

                      <div className="admin-form-field">
                        <label>Question *</label>
                        <input
                          value={faq.question}
                          onChange={(e) =>
                            updateFAQ(
                              index,
                              "question",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Is this trip suitable for beginners?"
                        />
                      </div>

                      <div className="admin-form-field">
                        <label>Answer *</label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) =>
                            updateFAQ(
                              index,
                              "answer",
                              e.target.value,
                            )
                          }
                          rows={4}
                          placeholder="Enter the answer..."
                        />
                      </div>
                    </div>
                  ))}

                </div>

                <button
                  type="button"
                  className="admin-add-button"
                  onClick={addFAQ}
                >
                  + Add FAQ
                </button>
              </section>
            )}
            {/* BOOKINGS */}

            {activeSection === "bookings" && (
            <section className="admin-form-section admin-bookings-form-section">
                <AdminTripBookings
                tripId={tripId}
                tripPrice={Number(price) || 8999}
                />
            </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}