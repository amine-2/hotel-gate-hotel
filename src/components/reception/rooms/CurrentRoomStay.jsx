import { CalendarDays, UserRound } from "lucide-react";

export default function CurrentRoomStay({
  stay,
  booking,
  onTransfer,
  onCheckout,
}) {
  if (!stay || !booking) {
    return null;
  }

  const isCheckedIn = stay.status === "checked_in";
  const isReserved = stay.status === "reserved";

  const statusLabel = isCheckedIn
    ? "Checked In"
    : isReserved
      ? "Reserved"
      : stay.status;

  const statusClass = isCheckedIn
    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Current Stay
        </h2>
      </div>

      <div className="p-5">
        {/* Guest */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700">
            <UserRound
              size={20}
              className="text-zinc-600 dark:text-zinc-300"
            />
          </div>

          <div>
            <p className="font-semibold text-zinc-900 dark:text-white">
              {booking.name || "Guest"}
            </p>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {booking.email || booking.phone || "No contact information"}
            </p>
          </div>
        </div>

        {/* Stay information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Guests
            </p>

            <p className="mt-1 font-medium text-zinc-900 dark:text-white">
              {booking.adults ?? 0} Adults
              {booking.children > 0 && ` · ${booking.children} Children`}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Check-in
            </p>

            <div className="mt-1 flex items-center justify-center gap-2 font-medium text-zinc-900 dark:text-white ">
              <CalendarDays size={16} />
             {formatDate(booking.check_in_date)}
            </div>
          </div>

          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Check-out
            </p>

            <div className="mt-1 flex items-center justify-center gap-2 font-medium text-zinc-900 dark:text-white">
              <CalendarDays size={16} />
              {formatDate(booking.check_out_date)}
            </div>
          </div>

          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Status
            </p>

            <span
              className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusClass}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Booking */}
        <div className="mt-5 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900/50">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Booking ID
              </p>

              <p className="mt-1 font-mono text-sm font-medium text-zinc-900 dark:text-white">
                #{booking.id}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Channel
              </p>

              <p className="mt-1 text-sm font-medium capitalize text-zinc-900 dark:text-white">
                {booking.channel || "Online"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onTransfer}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Transfer Room
          </button>

          {isCheckedIn && (
            <button
              type="button"
              onClick={onCheckout}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Check Out
            </button>
          )}
        </div>
      </div>
    </section>
  );
}