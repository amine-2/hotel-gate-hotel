export default function HotelDetailsForm({
  rating,
  min_price,
  discount,
  rooms_number,
  onFieldChange,
}) {
  return (
    <section className="rounded-xl border bg-white p-6 dark:bg-zinc-800 dark:text-white dark:border-gray-700">
      <SectionHeader
        title="Hotel Details"
        description="Manage pricing and hotel statistics."
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Rating"
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={rating}
          onChange={(value) =>
            onFieldChange("rating", value)
          }
        />

        <Field
          label="Minimum Price"
          value={min_price}
          onChange={(value) =>
            onFieldChange("min_price", value)
          }
        />

        <Field
          label="Discount"
          value={discount}
          onChange={(value) =>
            onFieldChange("discount", value)
          }
        />

        <Field
          label="Rooms Number"
          type="number"
          min="0"
          value={rooms_number}
          onChange={(value) =>
            onFieldChange("rooms_number", value)
          }
        />
      </div>
    </section>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  ...props
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
        {...props}
      />
    </div>
  );
}