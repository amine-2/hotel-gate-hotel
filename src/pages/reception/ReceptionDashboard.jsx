import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  DoorOpen,
  Users,
  Plus,
  CalendarCheck,
  CalendarClock,
  ClipboardList,
} from "lucide-react";

import { useHotel } from "../../auth/HotelContext";
import { getReceptionistDashboardStats } from "../../lib/receptionist/getReceptionistDashboardStats";
import { i } from "framer-motion/client";

export default function ReceptionDashboard() {
  const { profile } = useAuth();
  const { hotelId } = useHotel();
  const { t } = useTranslation("dashboard");

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    expectedArrivals: 0,
    expectedDepartures: 0,
    currentGuests: 0,
    pendingReservations: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hotelId) return;

    async function loadStats() {
      try {
        setLoading(true);
        setError("");

        const data = await getReceptionistDashboardStats(hotelId);
        setStats(data);
      } catch (err) {
        console.error("Failed to load receptionist dashboard stats:", err);

        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [hotelId]);

  const summaryCards = [
    {
      key: "totalRooms",
      label: "Total Rooms",
      value: stats.totalRooms,
      icon: BedDouble,
    },
    {
      key: "occupiedRooms",
      label: "Occupied Rooms",
      value: stats.occupiedRooms,
      icon: DoorOpen,
    },
    {
      key: "availableRooms",
      label: "Available Rooms",
      value: stats.availableRooms,
      icon: DoorOpen,
    },
    {
      key: "expectedArrivals",
      label: "Expected Arrivals Today",
      value: stats.expectedArrivals,
      icon: CalendarCheck,
    },
    {
      key: "expectedDepartures",
      label: "Expected Departures Today",
      value: stats.expectedDepartures,
      icon: CalendarClock,
    },
    {
      key: "currentGuests",
      label: "Current Guests",
      value: stats.currentGuests,
      icon: Users,
    },
    {
      key: "pendingReservations",
      label: "Pending Reservations",
      value: stats.pendingReservations,
      icon: ClipboardList,
    },
  ];

  return (
    <div className="flex min-h-full flex-col items-center p-16">
      <div className="w-[90%]">
        <h1 className="mb-6 text-3xl font-bold text-zinc-800 dark:text-zinc-300">
          {t("welcome")}, {profile?.full_name || "Receptionist"}
        </h1>

        <div className="w-full flex justify-between border-b border-zinc-300 pb-4 dark:border-zinc-700 mt-10">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-300">
            {t("overview")}
          </h2>

          <button
            onClick={() => navigate("/dashboard/reception/reservations/new")}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white 
            transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus size={18} />
            New Reservation
          </button>
        </div>

        {error && (
          <p className="mt-5 rounded-lg bg-red-100 px-4 py-3 text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.key}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {card.label}
                    </p>

                    <p className="mt-3 text-3xl font-bold text-zinc-800 dark:text-zinc-100">
                      {loading ? "—" : card.value}
                    </p>
                  </div>

                  <div className="rounded-xl bg-zinc-100 p-3 dark:bg-zinc-800">
                    <Icon className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
