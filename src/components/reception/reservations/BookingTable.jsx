import BookingRow from "./BookingRow";

export default function BookingTable({
  bookings,
  onBookingClick,
  t
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-255">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left dark:border-zinc-700 dark:bg-zinc-800/50">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {t("guest")}
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {t("room")}
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {t("checkIn")}
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {t("checkOut")}
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {t("guests")}
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {t("status")}
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {t("total")}
              </th>
            </tr>
          </thead>

          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  onClick={() => onBookingClick(booking)}
                  t={t}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-sm text-zinc-500"
                >
                  {t("noReservationsFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}