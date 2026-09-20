
export default function ReservationSummary({ form, onCreate, saving }) {
  const start = form.check_in_date
    ? new Date(`${form.check_in_date}T00:00:00`)
    : null;

  const end = form.check_out_date
    ? new Date(`${form.check_out_date}T00:00:00`)
    : null;

  let nights = 0;

  if (start && end && end > start) {
    nights = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  const pricePerNight = Number(form.price_per_night) || 0;
  const discountPercent = Number(form.discount) || 0;

  const roomTotal = pricePerNight * nights;
  const discountAmount = roomTotal * (discountPercent / 100);
  const total = Math.max(0, roomTotal - discountAmount);

  return (
    <section className="sticky top-6 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Reservation Summary
        </h2>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          On-site reservation
        </p>
      </div>

      <div className="space-y-5 p-6">
        {/* Guest */}
        <div>
          <p className="text-xs font-medium text-zinc-400">
            Guest
          </p>

          <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {form.name || "Guest name"}
          </p>
        </div>

        {/* Guests */}
        <div>
          <p className="text-xs font-medium text-zinc-400">
            Guests
          </p>

          <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {form.adults} adults, {form.children} children
          </p>
        </div>

        {/* Stay */}
        <div>
          <p className="text-xs font-medium text-zinc-400">
            Stay
          </p>

          <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {nights > 0
              ? `${nights} night${nights !== 1 ? "s" : ""}`
              : "—"}
          </p>
        </div>

        {/* Pricing */}
        <div className="border-t border-zinc-200 pt-5 dark:border-zinc-700">
          {/* Room */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Room
            </span>

            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {form.room_id ? "Selected" : "Not selected"}
            </span>
          </div>

          {/* Price per night */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Price / Night
            </span>

            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {pricePerNight > 0
                ? `${pricePerNight.toLocaleString()} DZD`
                : "—"}
            </span>
          </div>

          {/* Nights */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Nights
            </span>

            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {nights}
            </span>
          </div>

          {/* Room total */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Room Total
            </span>

            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {roomTotal > 0
                ? `${roomTotal.toLocaleString()} DZD`
                : "—"}
            </span>
          </div>

          {/* Discount */}
          {discountPercent > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Discount
              </span>

              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {discountPercent}%{" "}
                (-{discountAmount.toLocaleString()} DZD)
              </span>
            </div>
          )}

          {/* Final total */}
          <div className="mt-5 flex items-end justify-between border-t border-zinc-200 pt-5 dark:border-zinc-700">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total
            </span>

            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {total > 0
                ? `${total.toLocaleString()} DZD`
                : "—"}
            </span>
          </div>
        </div>

        {/* Create reservation */}
        <button
          type="button"
          onClick={onCreate}
          disabled={saving}
          className="w-full rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {saving ? "Creating Reservation..." : "Create Reservation"}
        </button>
      </div>
    </section>
  );
}


