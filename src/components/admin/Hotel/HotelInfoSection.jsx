export default function HotelInfoSection({ hotel }) {
  const name = hotel.name || {};
  const description = hotel.description || {};
  const location = hotel.location || {};

  return (
    <section className="rounded-xl border bg-white p-6 dark:bg-zinc-800 dark:text-white dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Hotel Information</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Information currently displayed for this hotel.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <InfoItem
          label="Name"
          value={name.en || "-"}
        />

        <InfoItem
          label="City"
          value={location.city?.en || "-"}
        />

        <InfoItem
          label="State"
          value={location.state || "-"}
        />

        <InfoItem
          label="Country"
          value={location.country || "-"}
        />

        <InfoItem
          label="Address"
          value={location.address?.en || "-"}
        />

        <InfoItem
          label="Postal Code"
          value={location.postalCode || "-"}
        />

        <InfoItem
          label="Rating"
          value={hotel.rating ?? "-"}
        />

        <InfoItem
          label="Minimum Price"
          value={hotel.min_price || "-"}
        />

        <InfoItem
          label="Discount"
          value={hotel.discount || "-"}
        />

        <InfoItem
          label="Rooms"
          value={hotel.rooms_number ?? "-"}
        />
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Description
        </p>

        <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
          {description.en || "-"}
        </p>
      </div>

      {(location.latitude != null || location.longitude != null) && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Coordinates
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {location.latitude ?? "-"}, {location.longitude ?? "-"}
          </p>
        </div>
      )}
    </section>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        {value}
      </p>
    </div>
  );
}