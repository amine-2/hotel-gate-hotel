import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import SummeryCard from "../../../SummeryCard";
import { getHotelStatsDaily } from "../../../../lib/statistics/getHotelStatsDaily";

const ranges = {
  today: 1,
  week: 7,
  month: 30,
  "3months": 90,
  "6months": 180,
  year: 365,
};

export default function HotelSummarySection() {
  const { hotelId } = useParams();

  const [range, setRange] = useState("today");
  const [statsDaily, setStatsDaily] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getHotelStatsDaily(hotelId);
      setStatsDaily(data || []);
    }

    if (hotelId) fetchData();
  }, [hotelId]);

  const summary = useMemo(() => {
    if (!statsDaily.length) {
      return {
        revenue: 0,
        bookings: 0,
        guests: 0,
        revenueGrowth: 0,
        bookingsGrowth: 0,
        guestsGrowth: 0,
      };
    }

    const days = ranges[range];

    const sorted = [...statsDaily].sort(
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
      arr.reduce((acc, item) => acc + (item[key] || 0), 0);

    const revenue = sum(current, "total_revenue");
    const bookings = sum(current, "total_bookings");
    const guests = sum(current, "guests");

    const prevRevenue = sum(previous, "total_revenue");
    const prevBookings = sum(previous, "total_bookings");
    const prevGuests = sum(previous, "guests");

    const growth = (current, prev) =>
      prev === 0 ? 100 : ((current - prev) / prev) * 100;

    return {
      revenue,
      bookings,
      guests,
      revenueGrowth: growth(revenue, prevRevenue),
      bookingsGrowth: growth(bookings, prevBookings),
      guestsGrowth: growth(guests, prevGuests),
    };
  }, [range, statsDaily]);

  return (
    <div className="flex flex-col gap-10 pb-10 border-b border-zinc-300">
      {/* Header */}
      <div className="flex gap-4 items-center">
        <h2 className="text-xl font-semibold dark:text-zinc-300">Summary</h2>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border rounded-full border-zinc-400 px-2 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
        >
          <option value="today">Today</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="3months">3 Months</option>
          <option value="6months">6 Months</option>
          <option value="year">Year</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummeryCard
          title="Revenue"
          value={summary.revenue}
          growth={summary.revenueGrowth}
        />
        <SummeryCard
          title="Guests"
          value={summary.guests}
          growth={summary.guestsGrowth}
        />
        <SummeryCard
          title="Bookings"
          value={summary.bookings}
          growth={summary.bookingsGrowth}
        />
      </div>
    </div>
  );
}