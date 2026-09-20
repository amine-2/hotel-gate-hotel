export default function ReservationGuestForm({ form, updateForm }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {" "}
      <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-700">
        {" "}
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Guest Information{" "}
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Enter the guest information for this reservation.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Full Name *
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            placeholder="Guest full name"
            required
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Phone
          </label>

          <input
            type="text"
            value={form.phone}
            onChange={(e) => updateForm({ phone: e.target.value })}
            placeholder="Phone number"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>

          <input
            type="email"
            value={form.email}
            onChange={(e) => updateForm({ email: e.target.value })}
            placeholder="Email address"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Adults *
          </label>

          <input
            type="number"
            min="1"
            value={form.adults}
            onChange={(e) =>
              updateForm({
                adults: Math.max(1, Number(e.target.value)),
              })
            }
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Children
          </label>

          <input
            type="number"
            min="0"
            value={form.children}
            onChange={(e) =>
              updateForm({
                children: Math.max(0, Number(e.target.value)),
              })
            }
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
      </div>
    </section>
  );
}
