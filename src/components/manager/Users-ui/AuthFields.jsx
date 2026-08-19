export default function AuthFields({ form, onChange }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Authentication</h3>

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => onChange("email", e.target.value)}
        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => onChange("password", e.target.value)}
        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
      />
    </div>
  );
}