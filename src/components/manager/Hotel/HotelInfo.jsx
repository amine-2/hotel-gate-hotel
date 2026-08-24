export default function HotelInfo({ hotel }) {
  const name = hotel?.name || {};
  const description = hotel?.description || {};
  const location = hotel?.location || {};

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
          Hotel Information
        </h2>

        <div className="space-y-5">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              Name
            </p>

            <div className="space-y-1">
              <p className="text-sm text-gray-900 dark:text-white">
                EN: {name.en || "—"}
              </p>

              <p className="text-sm text-gray-900 dark:text-white">
                FR: {name.fr || "—"}
              </p>

              <p className="text-sm text-gray-900 dark:text-white">
                AR: {name.ar || "—"}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              Description
            </p>

            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                EN: {description.en || "—"}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                FR: {description.fr || "—"}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                AR: {description.ar || "—"}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              Location
            </p>

            <div className="space-y-1">
              <p className="text-sm text-gray-900 dark:text-white">
                EN: {location.city.en || "—"} / {location.address.en || "—"}
              </p>

              <p className="text-sm text-gray-900 dark:text-white">
                FR: {location.city.fr || "—"} / {location.address.fr || "—"}
              </p>

              <p className="text-sm text-gray-900 dark:text-white">
                AR: {location.city.ar || "—"} / {location.address.ar || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
          Hotel Details
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <Detail label="Rating" value={hotel?.rating ?? 0} />
          <Detail label="Minimum Price" value={hotel?.min_price || "—"} />
          <Detail label="Discount" value={hotel?.discount || "—"} />
          <Detail label="Rooms" value={hotel?.rooms_number ?? 0} />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}