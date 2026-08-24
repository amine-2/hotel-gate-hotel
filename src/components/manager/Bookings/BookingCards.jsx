import { useState, useMemo, useEffect } from "react";
import BookingCard from "./BookingCard";
import { useHotel } from "../../../auth/HotelContext";
import { getOccupancyData } from "../../../lib/statistics/occupancyData";
import getHotelById from "../../../lib/hotels/getHotelById";
import { useTranslation } from "react-i18next";

const ranges = {
  today: 1,
  week: 7,
  month: 30,
  "3months": 90,
  "6months": 180,
  year: 365,
};

export default function BookingCards() {
  const { hotelId } = useHotel();

  const [range, setRange] = useState("today");
  const [hotelOccupancy, setHotelOccupancy] = useState([]);
  const [hotel, setHotel] = useState(null);

  const { t } = useTranslation(["common", "dashboard"]);

  useEffect(() => {
    if (!hotelId) return;

    async function fetchData() {
      const data = await getOccupancyData(hotelId);
      setHotelOccupancy(data || []);
    }

    async function fetchHotel() {
      const data = await getHotelById(hotelId);
      setHotel(data || null);
    }

    fetchData();
    fetchHotel();
  }, [hotelId, range]);

  const summary = useMemo(() => {
    if (!hotelOccupancy.length) {
      return {
        occupied_rooms: 0,
        guests: 0,
        occupied_roomsGrowth: 0,
        guestsGrowth: 0,
      };
    }

    const days = ranges[range];

    const sorted = [...hotelOccupancy].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const lastDate = new Date(sorted[sorted.length - 1].date);

    const startDate = new Date(lastDate);
    startDate.setDate(startDate.getDate() - days + 1);

    const prevStart = new Date(startDate);
    prevStart.setDate(prevStart.getDate() - days);

    const prevEnd = new Date(startDate);
    prevEnd.setDate(prevEnd.getDate() - 1);

    const current = sorted.filter(
      (d) =>
        new Date(d.date) >= startDate &&
        new Date(d.date) <= lastDate
    );

    const previous = sorted.filter(
      (d) =>
        new Date(d.date) >= prevStart &&
        new Date(d.date) <= prevEnd
    );

    const sum = (arr, key) =>
      arr.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);

    const occupied = sum(current, "occupancy");
    const guests = sum(current, "guests");

    const prevOccupied = sum(previous, "occupancy");
    const prevGuests = sum(previous, "guests");

    const growth = (current, previous) => {
      if (previous === 0) {
        return current === 0 ? 0 : 100;
      }

      return ((current - previous) / previous) * 100;
    };

    return {
      occupied_rooms: occupied,
      guests,

      occupied_roomsGrowth: growth(
        occupied,
        prevOccupied
      ),

      guestsGrowth: growth(
        guests,
        prevGuests
      ),
    };
  }, [range, hotelOccupancy]);

  const roomsAvailable = Math.max(
    0,
    Number(hotel?.rooms_number || 0) - summary.occupied_rooms
  );

  return (
    <div className="w-[90%] flex flex-col gap-12 pt-12 pbe-20 border-b border-zinc-300">
      {/* Header */}
      <div className="flex gap-4 items-center dark:text-zinc-300">
        <h2 className="text-xl font-semibold">
          Occupancy
        </h2>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border rounded-full border-zinc-400 px-2 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
        >
          <option value="today">
            {t("today", { ns: "common" })}
          </option>

          <option value="week">
            {t("week", { ns: "common" })}
          </option>

          <option value="month">
            1 {t("month", { ns: "common" })}
          </option>

          <option value="3months">
            3 {t("months", { ns: "common" })}
          </option>

          <option value="6months">
            6 {t("months", { ns: "common" })}
          </option>

          <option value="year">
            1 {t("year", { ns: "common" })}
          </option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BookingCard
          title="Rooms Occupied"
          value={summary.occupied_rooms}
          growth={summary.occupied_roomsGrowth ?  summary.occupied_roomsGrowth.toFixed(2) : "0"}
        />

        <BookingCard
          title="Guests Number"
          value={summary.guests}
          growth={summary.guestsGrowth ? summary.guestsGrowth.toFixed(2) : "0"}
        />

        <BookingCard
          title="Rooms Available"
          value={roomsAvailable}
        />
      </div>
    </div>
  );
}