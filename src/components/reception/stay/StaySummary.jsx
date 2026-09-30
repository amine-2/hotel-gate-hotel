function formatDateTime(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString();
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  const difference = end.getTime() - start.getTime();

  return Math.max(
    0,
    Math.round(difference / (1000 * 60 * 60 * 24))
  );
}

export default function StaySummary({ stay }) {
  const booking = stay.bookings;

  const nights = calculateNights(
    booking?.check_in_date,
    booking?.check_out_date
  );

  return (
    <section className="rounded-xl border border-gray-200 shadow dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
      <h2 className="text-lg font-semibold mb-4">
        Stay Summary
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div>
          <p className="text-xs text-gray-500">Stay ID</p>
          <p className="mt-1 text-sm font-medium break-all">
            {stay.id}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Status</p>
          <p className="mt-1 text-sm font-medium capitalize">
            {stay.status.replace("_", " ")}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Check-in</p>
          <p className="mt-1 text-sm font-medium">
            {formatDateTime(stay.checked_in_at)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Check-out</p>
          <p className="mt-1 text-sm font-medium">
            {formatDateTime(stay.checked_out_at)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Nights</p>
          <p className="mt-1 text-sm font-medium">
            {nights}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Adults</p>
          <p className="mt-1 text-sm font-medium">
            {booking?.adults || 0}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Children</p>
          <p className="mt-1 text-sm font-medium">
            {booking?.children || 0}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Created</p>
          <p className="mt-1 text-sm font-medium">
            {formatDateTime(stay.created_at)}
          </p>
        </div>
      </div>
    </section>
  );
}