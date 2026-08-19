
import { useState, useMemo, useEffect } from "react";
import SummeryCard from "../../SummeryCard";
import { getGlobalStats } from "../../../lib/statistics/getGlobalStats";
import { useTranslation } from "react-i18next";

const ranges = {
  today: 1,
  week: 7,
  month: 30,
  "3months": 90,
  "6months": 180,
  year: 365,
};

export default function SummarySection() {
  const [range, setRange] = useState("today");
  const [globalStatsDaily, setGlobalStatsDaily] = useState([]);

  const { t } = useTranslation([ "common", "dashboard" ]);
  // ✅ Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      const data = await getGlobalStats();
      setGlobalStatsDaily(data || []);
    }

    fetchData();
  }, []);

  const summary = useMemo(() => {
    if (!globalStatsDaily.length) {
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

    const sorted = [...globalStatsDaily].sort(
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
    const guests = sum(current, "total_guests");

    const prevRevenue = sum(previous, "total_revenue");
    const prevBookings = sum(previous, "total_bookings");
    const prevGuests = sum(previous, "total_guests");

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
  }, [range, globalStatsDaily]); 

  return (
    <div className="w-[90%] flex flex-col gap-12 pt-12 pbe-20 border-b border-zinc-300">
      {/* Header */}
      <div className="flex gap-4 items-center dark:text-zinc-300">
        <h2 className="text-xl font-semibold ">{t("summary", { ns: "dashboard" })}</h2>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border rounded-full border-zinc-400 px-2 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
        >
          <option value="today">{t("today", { ns: "common" })}</option>
          <option value="week">{t("week", { ns: "common" })}</option>
          <option value="month">1 {t("month", { ns: "common" })}</option>
          <option value="3months">3 {t("months", { ns: "common" })}</option>
          <option value="6months">6 {t("months", { ns: "common" })}</option>
          <option value="year">1 {t("year", { ns: "common" })}</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummeryCard title={t("totalRevenue", { ns: "dashboard" })} value={summary.revenue} growth={summary.revenueGrowth} />
        <SummeryCard title={t("totalGuests", { ns: "dashboard" })} value={summary.guests} growth={summary.guestsGrowth} />
        <SummeryCard title={t("totalBookings", { ns: "dashboard" })} value={summary.bookings} growth={summary.bookingsGrowth} />
      </div>
    </div>
  );
}