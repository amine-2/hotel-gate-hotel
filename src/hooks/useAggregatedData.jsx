import { useState, useMemo } from "react";

/**
 * Generic aggregation hook
 * Filters by date range and aggregates grouped values
 */
export const useAggregatedData = (
  data,
  {
    dateKey = "date",
    groupByKey,
    valueKey,
    initialFilter = "month",
  }
) => {
  const [filter, setFilter] = useState(initialFilter);

  const aggregatedData = useMemo(() => {
    if (!data?.length || !groupByKey || !valueKey) return [];

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let startDate = new Date(now);

    switch (filter) {
      case "today":
        // startDate already equals today
        break;

      case "week":
        startDate.setDate(now.getDate() - 6);
        break;

      case "month":
        startDate.setDate(now.getDate() - 29);
        break;

      case "6months":
        startDate.setMonth(now.getMonth() - 5);
        startDate.setDate(1);
        break;

      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        startDate.setMonth(now.getMonth() + 1);
        startDate.setDate(1);
        break;

      default:
        startDate.setDate(now.getDate() - 29);
    }

    startDate.setHours(0, 0, 0, 0);

    // 🔹 Filter by date range
    const filtered = data.filter((item) => {
      const d = new Date(item[dateKey]);
      d.setHours(0, 0, 0, 0);
      return d >= startDate && d <= now;
    });

    // 🔹 Aggregate by group
    const grouped = filtered.reduce((acc, item) => {
      const group = item[groupByKey];
      const value = Number(item[valueKey] || 0);

      if (!acc[group]) acc[group] = 0;
      acc[group] += value;

      return acc;
    }, {});

    // 🔹 Convert to usable format
    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  }, [data, dateKey, groupByKey, valueKey, filter]);

  return { filter, setFilter, aggregatedData };
};