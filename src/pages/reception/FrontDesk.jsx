import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  LogIn,
  LogOut,
  Users,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { useHotel } from "../../auth/HotelContext";

import { getFrontDeskData } from "../../lib/receptionist/getFrontDeskData";
import { updateStay } from "../../lib/receptionist/updateStay";
import SummaryCard from "../../components/reception/frontdesk/SummaryCard";
import SectionHeader from "../../components/reception/frontdesk/SectionHeader";
import ArrivalRow from "../../components/reception/frontdesk/ArrivalRow";
import DepartureRow from "../../components/reception/frontdesk/DepartureRow";
import CurrentStayRow from "../../components/reception/frontdesk/CurrentStayRow";
import PendingRow from "../../components/reception/frontdesk/PendingRow";
import EmptyState from "../../components/reception/frontdesk/EmptyState";
import ShiftHandoverSection from "../../components/reception/frontdesk/ShiftHandoverSection";
import ExpiredReservationsCleanup from "../../components/reception/frontdesk/ExpiredReservationsCleanup";

export default function FrontDesk() {
  const navigate = useNavigate();
  const { hotelId } = useHotel();

  const [data, setData] = useState({
    today: "",
    arrivals: [],
    departures: [],
    currentStays: [],
    pendingReservations: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const loadFrontDesk = useCallback(async () => {
    if (!hotelId) return;

    try {
      setLoading(true);
      setError("");

      const result = await getFrontDeskData(hotelId);

      setData(result);
    } catch (err) {
      console.error("Failed to load front desk:", err);
      setError(err.message || "Failed to load front desk");
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    loadFrontDesk();
  }, [loadFrontDesk]);

  async function handleCheckIn(stayId, bookingId) {
    try {
      setActionLoading(stayId);
      setError("");

      await updateStay({
        hotelId,
        stayId,
        updates: {
          status: "checked_in",
        },
      });

      await loadFrontDesk();

      navigate(`/dashboard/reception/reservations/${bookingId}`);
    } catch (err) {
      console.error("Failed to check in:", err);
      setError(err.message || "Failed to check in guest");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCheckOut(stayId, bookingId) {
    try {
      setActionLoading(stayId);
      setError("");

      await updateStay({
        hotelId,
        stayId,
        updates: {
          status: "checked_out",
        },
      });

      await loadFrontDesk();

      navigate(`/dashboard/reception/reservations/${bookingId}`);
    } catch (err) {
      console.error("Failed to check out:", err);
      setError(err.message || "Failed to check out guest");
    } finally {
      setActionLoading(null);
    }
  }

  function getRoomType(stay) {
    return stay?.room?.room_type?.name?.en || "Room";
  }

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center p-8">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading front desk...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col p-8 pt-16 pl-16">
      <div className="mx-auto w-[95%]">
        {/* HEADER */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200">
              Front Desk
            </h1>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Today's arrivals, departures and guest operations
            </p>
          </div>

          <ExpiredReservationsCleanup onCleaned={loadFrontDesk} />

          <button
            type="button"
            onClick={loadFrontDesk}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Refresh
          </button>
        </div>

        {/* DATE */}
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <CalendarDays size={17} />
          <span>
            {data.today
              ? new Date(`${data.today}T00:00:00`).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Today"}
          </span>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* SUMMARY */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={LogIn}
            title="Today's Arrivals"
            value={data.arrivals.length}
          />

          <SummaryCard
            icon={LogOut}
            title="Today's Departures"
            value={data.departures.length}
          />

          <SummaryCard
            icon={Users}
            title="Currently Staying"
            value={data.currentStays.length}
          />

          <SummaryCard
            icon={Clock}
            title="Pending Reservations"
            value={data.pendingReservations.length}
          />
        </div>

        <ShiftHandoverSection />

        {/* ARRIVALS */}
        <section className="mb-8 mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <SectionHeader
            icon={LogIn}
            title="Today's Arrivals"
            count={data.arrivals.length}
          />

          {data.arrivals.length === 0 ? (
            <EmptyState text="No arrivals scheduled for today." />
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {data.arrivals.map((booking) => (
                <ArrivalRow
                  key={booking.id}
                  booking={booking}
                  actionLoading={actionLoading}
                  onCheckIn={handleCheckIn}
                  onOpen={() =>
                    navigate(`/dashboard/reception/reservations/${booking.id}`)
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* DEPARTURES */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <SectionHeader
            icon={LogOut}
            title="Today's Departures"
            count={data.departures.length}
          />

          {data.departures.length === 0 ? (
            <EmptyState text="No departures scheduled for today." />
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {data.departures.map((booking) => (
                <DepartureRow
                  key={booking.id}
                  booking={booking}
                  actionLoading={actionLoading}
                  onCheckOut={handleCheckOut}
                  onOpen={() =>
                    navigate(`/dashboard/reception/reservations/${booking.id}`)
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* CURRENT STAYS */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <SectionHeader
            icon={Users}
            title="Currently Staying"
            count={data.currentStays.length}
          />

          {data.currentStays.length === 0 ? (
            <EmptyState text="There are currently no checked-in guests." />
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {data.currentStays.map((stay) => (
                <CurrentStayRow
                  key={stay.id}
                  stay={stay}
                  roomType={getRoomType(stay.booking)}
                  onOpen={() =>
                    navigate(
                      `/dashboard/reception/reservations/${stay.booking_id}`,
                    )
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* PENDING */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          <SectionHeader
            icon={Clock}
            title="Pending Reservations"
            count={data.pendingReservations.length}
          />

          {data.pendingReservations.length === 0 ? (
            <EmptyState text="There are no pending reservations." />
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {data.pendingReservations.map((booking) => (
                <PendingRow
                  key={booking.id}
                  booking={booking}
                  onOpen={() =>
                    navigate(`/dashboard/reception/reservations/${booking.id}`)
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
