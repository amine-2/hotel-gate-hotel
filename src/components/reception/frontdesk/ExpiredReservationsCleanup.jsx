import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, Trash2 } from "lucide-react";
import { useHotel } from "../../../auth/HotelContext";
import {
  cleanupExpiredPendingReservations,
  getExpiredPendingReservationCount,
} from "../../../lib/receptionist/getFrontDeskData";

export default function ExpiredReservationsCleanup({
  onCleaned,
}) {
  const { hotelId } = useHotel();

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cleaning, setCleaning] = useState(false);
  const [message, setMessage] = useState("");

  const loadCount = useCallback(async () => {
    if (!hotelId) return;

    try {
      setLoading(true);
      setMessage("");

      const expiredCount =
        await getExpiredPendingReservationCount(hotelId);

      setCount(expiredCount);
    } catch (error) {
      console.error(
        "Failed to load expired reservation count:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    loadCount();
  }, [loadCount]);

  async function handleCleanup() {
    if (!count || cleaning) return;

    const confirmed = window.confirm(
      `Are you sure you want to clean ${count} expired pending reservation${
        count !== 1 ? "s" : ""
      }?\n\nThey will be marked as cancelled.`
    );

    if (!confirmed) return;

    try {
      setCleaning(true);
      setMessage("");

      const cleaned =
        await cleanupExpiredPendingReservations(hotelId);

      setCount(0);

      setMessage(
        `${cleaned.length} expired reservation${
          cleaned.length !== 1 ? "s" : ""
        } cleaned.`
      );

      if (onCleaned) {
        onCleaned();
      }
    } catch (error) {
      console.error(
        "Failed to clean expired reservations:",
        error
      );

      setMessage(
        error.message ||
          "Failed to clean expired reservations."
      );
    } finally {
      setCleaning(false);
    }
  }

  if (loading || count === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {message && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <Check size={16} />
          {message}
        </div>
      )}

      <button
        type="button"
        disabled={cleaning}
        onClick={handleCleanup}
        className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
      >
        {cleaning ? (
          <Loader2 size={17} className="animate-spin" />
        ) : (
          <Trash2 size={17} />
        )}

        {cleaning
          ? "Cleaning..."
          : `Clean (${count})`}
      </button>
    </div>
  );
}