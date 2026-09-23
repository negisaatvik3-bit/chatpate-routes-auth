import { useEffect, useState } from "react";
import { getCurrentTripDate } from "@/lib/trip-dates";

export function useCurrentTripDate() {
  const [today, setToday] = useState(getCurrentTripDate);

  useEffect(() => {
    const refreshDate = () => setToday(getCurrentTripDate());
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refreshDate();
    };
    const interval = window.setInterval(refreshDate, 60_000);

    window.addEventListener("focus", refreshDate);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshDate);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  return today;
}
