export default function BookingRow({
  booking,
  onClick,
}) {
  const statusStyles = {
    confirmed:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",

    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",

    cancelled:
      "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  };

  const guestCount =
    (booking.adults || 0) + (booking.children || 0);

  return (
    <tr
      onClick={onClick}
      className="cursor-pointer border-b border-zinc-100 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
    >
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-zinc-800 dark:text-zinc-200">
            {booking.name}
          </p>

          <p className="mt-1 text-xs text-zinc-400">
            #{booking.id}
          </p>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
        {booking.room?.room_number || "—"}
      </td>

      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
        {booking.check_in_date}
      </td>

      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
        {booking.check_out_date}
      </td>

      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
        {guestCount}
      </td>

      <td className="px-6 py-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
            statusStyles[booking.status] ||
            "bg-zinc-100 text-zinc-600"
          }`}
        >
          {booking.status}
        </span>
      </td>

      <td className="px-6 py-4 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        {booking.total_price ?? 0} DA
      </td>
    </tr>
  );
}