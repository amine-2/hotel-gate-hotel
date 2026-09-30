function Employee({ label, profile, date }) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium">
        {profile?.full_name || "Unknown employee"}
      </p>

      {date && (
        <p className="text-xs text-gray-500 mt-1">
          {new Date(date).toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default function StayPeople({ stay }) {
  return (
    <section className="rounded-xl border border-gray-200 shadow dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
      <h2 className="text-lg font-semibold mb-4">
        Stay Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Employee
          label="Checked in by"
          profile={stay.checked_in_profile}
          date={stay.checked_in_at}
        />

        <Employee
          label="Checked out by"
          profile={stay.checked_out_profile}
          date={stay.checked_out_at}
        />
      </div>
    </section>
  );
}