import { useEffect, useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext";
import { getStayHistory } from "../../lib//receptionist/stays/getStayHistory";
import StayHistoryRow from "../../components/reception/stay/StayHistoryRow";

export default function StayHistory() {
  const { profile } = useAuth();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomId");

  const [stays, setStays] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hotelId = profile?.hotel_id;

  useEffect(() => {
    async function loadHistory() {
      if (!hotelId) return;

      setLoading(true);
      setError(null);

      const result = await getStayHistory(
        hotelId,
        roomId
      );

      if (result.error) {
        setError(result.error.message);
      } else {
        setStays(result.data);
      }

      setLoading(false);
    }

    loadHistory();
  }, [hotelId, roomId]);

  const filteredStays = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return stays;
    }

    return stays.filter((stay) => {
      const roomNumber =
        stay.rooms?.room_number?.toLowerCase() || "";

      const guestName =
        stay.bookings?.name?.toLowerCase() || "";

      const bookingId =
        stay.booking_id?.toLowerCase() || "";

      return (
        roomNumber.includes(value) ||
        guestName.includes(value) ||
        bookingId.includes(value)
      );
    });
  }, [stays, search]);

  if (!hotelId) {
    return (
      <div className="p-16">
        <p className="text-sm text-zinc-500">
          User does not belong to a hotel.
        </p>
      </div>
    );
  }

  return (
    <div className="p-16 space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">
          Stay History
        </h1>

        <p className="text-sm text-zinc-500 mt-1">
          View completed and checked-out stays.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xl">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search room number, guest name, or booking ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </div>
      </div>

      {roomId && (
        <div className="text-sm text-zinc-500">
          Showing history for the selected room.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900 p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
        <div className="grid grid-cols-[90px_1.5fr_1.2fr_1fr_1fr_32px] gap-4 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 text-xs font-medium text-zinc-500">
          <span>Room</span>
          <span>Guest</span>
          <span>Booking</span>
          <span>Check-in</span>
          <span>Check-out</span>
          <span />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2
              size={22}
              className="animate-spin text-zinc-400"
            />
          </div>
        ) : filteredStays.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-zinc-500">
              No checked-out stays found.
            </p>
          </div>
        ) : (
          filteredStays.map((stay) => (
            <StayHistoryRow
              key={stay.id}
              stay={stay}
              onClick={() =>
                navigate(
                  `/dashboard/reception/stay-history/${stay.id}`
                )
              }
            />
          ))
        )}
      </div>
    </div>
  );
}