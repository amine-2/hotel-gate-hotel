import { useHotel } from "../../../auth/HotelContext";
import { useRecentCandidates } from "../../../hooks/useRecentCandidates";

function getStatusLabel(status) {
  switch (status) {
    case "new":
      return "New";

    case "reviewing":
      return "Reviewing";

    case "interview":
      return "Interview";

    case "accepted":
      return "Accepted";

    case "rejected":
      return "Rejected";

    default:
      return status;
  }
}

export default function RecentCandidates() {
  const { hotelId } = useHotel();

  const {
    candidates,
    loading,
    error,
  } = useRecentCandidates(hotelId, 5);

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Candidates
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
            <tr>
              <th className="px-5 py-3 font-medium">
                Candidate
              </th>

              <th className="px-5 py-3 font-medium">
                Position
              </th>

              <th className="px-5 py-3 font-medium">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-5 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading candidates...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-5 py-6 text-center text-red-500"
                >
                  Failed to load candidates.
                </td>
              </tr>
            ) : candidates.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-5 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No candidates yet.
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                    {candidate.name}
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {candidate.position}
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {getStatusLabel(candidate.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}