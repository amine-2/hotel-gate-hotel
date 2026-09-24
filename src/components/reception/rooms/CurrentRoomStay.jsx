import { CalendarDays, UserRound } from "lucide-react";

export default function CurrentRoomStay({
  stay,
  booking,
  onTransfer,
  onAddCharge,
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
    <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Current Stay
        </h2>
      </div>

      <div className="p-5">
        {/* Guest */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <UserRound
              size={20}
              className="text-gray-600 dark:text-gray-300"
            />
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {booking.name || "Guest"}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {booking.email || booking.phone || "No contact information"}
            </p>
          </div>
        </div>

        {/* Stay information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Guests
            </p>

            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {booking.adults ?? 0} Adults
              {booking.children > 0 && ` · ${booking.children} Children`}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Check-in
            </p>

            <div className="mt-1 flex items-center justify-center gap-2 font-medium text-gray-900 dark:text-white ">
              <CalendarDays size={16} />
             {formatDate(booking.check_in_date)}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Check-out
            </p>

            <div className="mt-1 flex items-center justify-center gap-2 font-medium text-gray-900 dark:text-white">
              <CalendarDays size={16} />
              {formatDate(booking.check_out_date)}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
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
        <div className="mt-5 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Booking ID
              </p>

              <p className="mt-1 font-mono text-sm font-medium text-gray-900 dark:text-white">
                #{booking.id}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Channel
              </p>

              <p className="mt-1 text-sm font-medium capitalize text-gray-900 dark:text-white">
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
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Transfer Room
          </button>

          <button
            type="button"
            onClick={onAddCharge}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Add Charge
          </button>

          {isCheckedIn && (
            <button
              type="button"
              onClick={onCheckout}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Check Out
            </button>
          )}
        </div>
      </div>
    </section>
  );
}