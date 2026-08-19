export default function PersonalFields({ form, onChange }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Personal Info</h3>

      <input
        placeholder="Full Name"
        value={form.full_name}
        onChange={(e) => onChange("full_name", e.target.value)}
        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
      />

      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => onChange("phone", e.target.value)}
        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
      />
    </div>
  );
}