import useCountUp from "../../../hooks/useCountUp";

export default function HRStatCard({ label, value, loading }) {
  const { count, ref } = useCountUp(value, 1200 );
  

  return (
    <div
      ref={ref}
      className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
    >
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
        {loading ? (
          <span className="inline-block h-9 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        ) : (
          count
        )}
      </p>
    </div>
  );
}