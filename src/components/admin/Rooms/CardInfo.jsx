export default function CardInfo({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-zinc-700">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}