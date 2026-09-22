import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Bell, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { useHotel } from "../../../auth/HotelContext";
import { getUnreadReceivedHandoverCount } from "../../../lib/receptionist/shiftHandovers";

export default function ShiftHandoverSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hotelId } = useHotel();

  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    if (!hotelId || !user?.id) return;

    try {
      const count = await getUnreadReceivedHandoverCount({
        hotelId,
        userId: user.id,
      });

      setUnreadCount(count);
    } catch (error) {
      console.error(
        "Failed to load unread handover count:",
        error
      );
    }
  }, [hotelId, user?.id]);

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  return (
    <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <FileText size={21} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              Shift Handover
            </h2>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Pass important information to the next receptionist.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() =>
                navigate("/dashboard/reception/shift-handover")
              }
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              title={`${unreadCount} unread handover${
                unreadCount !== 1 ? "s" : ""
              }`}
            >
              <Bell size={19} />

              <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/reception/frontdesk/shift-handover")
            }
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Open Handover
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}