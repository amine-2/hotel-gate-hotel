import { useState, useMemo } from "react";

export const useDateFilter = (
  data,
  dateKey,
  initialFilter = "week"
) => {
  const [filter, setFilter] = useState(initialFilter);

  const filteredData = useMemo(() => {
    if (!data || !data.length) return [];

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let startDate = new Date(now);

    switch (filter) {
      case "week":
        startDate.setDate(now.getDate() - 6);
        break;

      case "month":
        startDate.setDate(now.getDate() - 29);
        break;

      case "6months":
        startDate.setMonth(now.getMonth() - 6);
        break;

      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;

      default:
        startDate.setDate(now.getDate() - 29);
    }

    startDate.setHours(0, 0, 0, 0);

    return data.filter((item) => {
      const d = new Date(item[dateKey]);
      d.setHours(0, 0, 0, 0);
      return d >= startDate && d <= now;
    });
  }, [data, dateKey, filter]);

  return { filter, setFilter, filteredData };
};