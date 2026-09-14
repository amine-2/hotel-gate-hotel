export default function TextAreaField({ label, value, onChange, placeholder, dir, disabled }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-zinc-300">
        {label}
      </label>

      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        dir={dir}
        disabled={disabled}
        className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 dark:bg-zinc-800 dark:text-zinc-300"
      />
    </div>
  );
}