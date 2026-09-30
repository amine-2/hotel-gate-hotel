import { CalendarDays, ChevronRight, DoorOpen } from "lucide-react";

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString();
}

export default function StayHistoryRow({ stay, onClick }) {
  const booking = stay.bookings;
  const room = stay.rooms;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left border-b border-gray-200 dark:border-gray-800 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition"
    >
      <div className="grid grid-cols-[90px_1.5fr_1.2fr_1fr_1fr_32px] items-center gap-4">
        <div className="flex items-center gap-2">
          <DoorOpen size={16} />
          <span className="font-medium">
            {room?.room_number || "-"}
          </span>
        </div>

        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {booking?.name || "-"}
          </p>

          <p className="text-xs text-gray-500">
            {booking?.adults || 0} adults
            {booking?.children > 0
              ? ` · ${booking.children} children`
              : ""}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium">
            {booking?.id || stay.booking_id}
          </p>

          <p className="text-xs text-gray-500">
            {booking?.channel || "-"}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1 text-sm">
            <CalendarDays size={14} />
            {formatDate(stay.checked_in_at)}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-sm">
            <CalendarDays size={14} />
            {formatDate(stay.checked_out_at)}
          </div>
        </div>

        <div className="flex justify-end">
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </div>
    </button>
  );
}