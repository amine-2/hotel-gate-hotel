function money(value) {
  if (value === null || value === undefined) {
    return "-";
  }

  return `${Number(value).toLocaleString()} DZD`;
}

export default function StayBooking({ stay }) {
  const booking = stay.bookings;

  return (
    <section className="rounded-xl border border-gray-200 shadow dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
      <h2 className="text-lg font-semibold mb-4">
        Booking Details
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div>
          <p className="text-xs text-gray-500">Booking ID</p>
          <p className="mt-1 text-sm font-medium break-all">
            {booking?.id || stay.booking_id}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Guest</p>
          <p className="mt-1 text-sm font-medium">
            {booking?.name || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Channel</p>
          <p className="mt-1 text-sm font-medium capitalize">
            {booking?.channel || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Payment Method</p>
          <p className="mt-1 text-sm font-medium capitalize">
            {booking?.payment_method || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Price / Night</p>
          <p className="mt-1 text-sm font-medium">
            {money(booking?.price_per_night)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Discount</p>
          <p className="mt-1 text-sm font-medium">
            {booking?.discount ?? 0}%
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Booking Total</p>
          <p className="mt-1 text-sm font-medium">
            {money(booking?.total_price)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Guests</p>
          <p className="mt-1 text-sm font-medium">
            {booking?.adults || 0} adults
            {booking?.children
              ? ` · ${booking.children} children`
              : ""}
          </p>
        </div>
      </div>

      {(booking?.email || booking?.phone) && (
        <div className="mt-5 pt-5 border-t border-gray-200 dark:border-zinc-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {booking.email && (
              <div>
                <p className="text-xs text-gray-500">
                  Email
                </p>
                <p className="text-sm mt-1">
                  {booking.email}
                </p>
              </div>
            )}

            {booking.phone && (
              <div>
                <p className="text-xs text-gray-500">
                  Phone
                </p>
                <p className="text-sm mt-1">
                  {booking.phone}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {booking?.notes && (
        <div className="mt-5 pt-5 border-t border-gray-200 dark:border-zinc-700">
          <p className="text-xs text-gray-500">
            Booking Notes
          </p>

          <p className="text-sm mt-1 whitespace-pre-wrap">
            {booking.notes}
          </p>
        </div>
      )}
    </section>
  );
}