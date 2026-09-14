export default function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 dark:bg-zinc-700">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-medium capitalize text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}