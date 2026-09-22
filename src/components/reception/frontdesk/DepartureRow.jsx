import { CheckCircle } from "lucide-react";

export default function DepartureRow({
  booking,
  actionLoading,
  onCheckOut,
  onOpen,
}) {
  const stay = booking.hotel_stay;

  return (
    <div className="flex items-center justify-between gap-6 px-6 py-5">
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-zinc-800 dark:text-zinc-200">
          {booking.name}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Room {booking.room?.room_number || "—"}</span>

          <span>Check-out: {booking.check_out_date}</span>

          <span>
            {booking.adults || 0} adults, {booking.children || 0} children
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpen}
          className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Details
        </button>

        {stay?.status === "checked_in" && (
          <button
            type="button"
            disabled={actionLoading === stay.id}
            onClick={() => onCheckOut(stay.id, booking.id)}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            <CheckCircle size={16} />

            {actionLoading === stay.id ? "Checking out..." : "Check Out"}
          </button>
        )}
      </div>
    </div>
  );
}
