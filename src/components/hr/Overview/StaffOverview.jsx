import { useHotel } from "../../../auth/HotelContext";
import { useStaffOverview } from "../../../hooks/useStaffOverview";
import useCountUp from "../../../hooks/useCountUp";

function DepartmentRow({ name, count, maxCount }) {
  const { count: animatedCount, ref } = useCountUp(count, 1200);

  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

  return (
    <div ref={ref}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {name}
        </span>

        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {animatedCount}
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-orange-300 transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function StaffOverview() {
  const { hotelId } = useHotel();

  const {
    data: departments,
    loading,
    error,
  } = useStaffOverview(hotelId);

  const maxCount = departments.length
    ? Math.max(...departments.map((department) => department.count))
    : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Staff Overview
      </h2>

      {loading ? (
        <div className="mt-5 space-y-5">
          {[1, 2, 3, 4].map((item) => (
            <div key={item}>
              <div className="mb-2 flex justify-between">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>

              <div className="h-2.5 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="mt-5 text-sm text-red-500">
          Failed to load staff overview.
        </p>
      ) : departments.length === 0 ? (
        <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
          No staff found.
        </p>
      ) : (
        <div className="mt-5 space-y-5">
          {departments.map((department) => (
            <DepartmentRow
              key={department.name}
              name={department.name}
              count={department.count}
              maxCount={maxCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}