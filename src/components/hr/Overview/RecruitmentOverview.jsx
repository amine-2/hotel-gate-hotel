import { useHotel } from "../../../auth/HotelContext";
import { useRecruitmentStats } from "../../../hooks/useRecruitmentStats";

export default function RecruitmentOverview() {
  const { hotelId } = useHotel();

  const {
    stats,
    loading,
    error,
  } = useRecruitmentStats(hotelId);

  const recruitmentStats = [
    {
      label: "New",
      count: stats.new,
    },
    {
      label: "Reviewing",
      count: stats.reviewing,
    },
    {
      label: "Interview",
      count: stats.interview,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Recruitment
      </h2>

      <div className="mt-5 space-y-4">
        {loading ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : error ? (
          <div className="text-sm text-red-500">
            Failed to load recruitment stats.
          </div>
        ) : (
          recruitmentStats.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {item.label}
              </span>

              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.count}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}