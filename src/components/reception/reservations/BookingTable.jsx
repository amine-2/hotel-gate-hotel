import BookingRow from "./BookingRow";

export default function BookingTable({
  bookings,
  onBookingClick,
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-255">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left dark:border-zinc-700 dark:bg-zinc-800/50">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Guest
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Room
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Check-in
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Check-out
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Guests
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Status
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Total
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
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-sm text-zinc-500"
                >
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}