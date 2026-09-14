export default function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  disabled,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-zinc-400">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 dark:bg-zinc-800 dark:text-zinc-300"
      />
    </div>
  );
}