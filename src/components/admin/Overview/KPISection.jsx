import { useEffect, useState } from "react";
import KPICard from "./KPICard";

import {
  getVisitors,
  getBookingStarts,
  getBookings,
} from "../../../lib/analytics/queries";

import { getDateRange } from "../../../lib/analytics/dateRanges";
import { calculateGrowth } from "../../../lib/analytics/calculateGrowth";

function KPISection() {
  const [filter, setFilter] = useState("7d");

  const [stats, setStats] = useState({
    visitors: 0,
    starts: 0,
    confirmed: 0,

    visitorsGrowth: 0,
    bookingsGrowth: 0,
    conversionGrowth: 0,
  });

  useEffect(() => {
    async function load() {
      const { startDate, endDate, previousStartDate, previousEndDate } =
        getDateRange(filter);

      /* CURRENT */

      const [visitors, starts, confirmed] = await Promise.all([
        getVisitors(startDate, endDate),
        getBookingStarts(startDate, endDate),
        getBookings(startDate, endDate),
      ]);

      /* PREVIOUS */

      const [previousVisitors, previousStarts, previousConfirmed] =
        await Promise.all([
          getVisitors(previousStartDate, previousEndDate),
          getBookingStarts(previousStartDate, previousEndDate),
          getBookings(previousStartDate, previousEndDate),
        ]);

      /* CONVERSION */

      const conversion = starts > 0 ? (confirmed / starts) * 100 : 0;

      const previousConversion =
        previousStarts > 0 ? (previousConfirmed / previousStarts) * 100 : 0;

      setStats({
        visitors,
        starts,
        confirmed,

        visitorsGrowth: calculateGrowth(visitors, previousVisitors),

        bookingsGrowth: calculateGrowth(confirmed, previousConfirmed),

        conversionGrowth: calculateGrowth(conversion, previousConversion),
      });
    }

    load();
  }, [filter]);
  return (
    
      <div className="w-[90%] flex flex-col gap-12 pt-12 pbe-20 border-b border-zinc-300">
        <div className="flex gap-4 items-center dark:text-zinc-300">
          <h2 className="text-xl font-semibold ">Website Performance</h2>
          
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-full border-zinc-400 px-2 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="3m">Last 3 months</option>
              <option value="6m">Last 6 months</option>
              <option value="1y">Last year</option>
            </select>
          
        </div>

        {/* 🔹 KPI ROW */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-55">
            <KPICard
              title="Visitors"
              value={stats.visitors}
              growth={stats.visitorsGrowth}
            />
          </div>
          <div className="flex-1 min-w-55">
            <KPICard
              title="Bookings"
              value={stats.confirmed}
              growth={stats.bookingsGrowth}
            />
          </div>
          <div className="flex-1 min-w-55">
            <KPICard
              title="Conversion"
              value={
                stats.starts && stats.confirmed
                  ? ((stats.confirmed / stats.starts) * 100).toFixed(2)
                  : 0
              }
              growth={stats.conversionGrowth}
            />
          </div>
        </div>
      </div>
    
  );
}

export default KPISection;
