const TRIP_TIME_ZONE = "Asia/Kolkata";

export function getCurrentTripDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TRIP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: "year" | "month" | "day") =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

function dateKey(date: string | null | undefined) {
  return date?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? null;
}

export function isUpcomingTrip(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  today = getCurrentTripDate(),
) {
  const lastTripDate = dateKey(endDate) ?? dateKey(startDate);

  return lastTripDate !== null && lastTripDate >= today;
}

export function isPastTrip(
  endDate: string | null | undefined,
  today = getCurrentTripDate(),
) {
  const lastTripDate = dateKey(endDate);

  return lastTripDate !== null && lastTripDate < today;
}
