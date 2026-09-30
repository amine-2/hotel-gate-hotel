import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext";
import { getStayDetails } from "../../lib/receptionist/stays/getStayDetails";

import StaySummary from "../../components/reception/stay/StaySummary";
import StayPeople from "../../components/reception/stay/StayPeople";
import StayRoom from "../../components/reception/stay/StayRoom";
import StayTransfers from "../../components/reception/stay/StayTransfers";
import StayBooking from "../../components/reception/stay/StayBooking";
import StayCharges from "../../components/reception/stay/StayCharges";

export default function StayDetails() {
  const { profile } = useAuth();

  const navigate = useNavigate();
  const { stayId } = useParams();

  const [stay, setStay] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hotelId = profile?.hotel_id;

  useEffect(() => {
    async function loadStay() {
      if (!hotelId || !stayId) return;

      setLoading(true);
      setError(null);

      const result = await getStayDetails(
        hotelId,
        stayId
      );

      if (result.error) {
        setError(result.error.message);
      } else {
        setStay(result.data);
      }

      setLoading(false);
    }

    loadStay();
  }, [hotelId, stayId]);

  if (!hotelId) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">
          User does not belong to a hotel.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2
          size={24}
          className="animate-spin text-gray-400"
        />
      </div>
    );
  }

  if (error || !stay) {
    return (
      <div className="p-16 space-y-4">
        <button
          type="button"
          onClick={() =>
            navigate("/dashboard/reception/stay-history")
          }
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Stay History
        </button>

        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900 p-4 text-sm text-red-600 dark:text-red-400">
          {error || "Stay not found."}
        </div>
      </div>
    );
  }

  const booking = stay.bookings;

  return (
    <div className="p-16 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/reception/stay-history")
            }
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-3"
          >
            <ArrowLeft size={16} />
            Back to Stay History
          </button>

          <h1 className="text-2xl font-semibold">
            Stay Details
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {booking?.name || "Unknown guest"}
            {" · "}
            Room {stay.rooms?.room_number || "-"}
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 capitalize">
          {stay.status.replace("_", " ")}
        </span>
      </div>

      <StaySummary stay={stay} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <StayPeople stay={stay} />
        <StayRoom stay={stay} />
      </div>

      <StayTransfers transfers={stay.transfers} />

      <StayBooking stay={stay} />

      <StayCharges charges={stay.stay_charges} />
    </div>
  );
}