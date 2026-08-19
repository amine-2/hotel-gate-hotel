import { useState, useMemo } from "react";

export const useTableFilters = ({
  data = [],
  dateKey,
  searchKeys = [],
  statusKey,
  initialDateFilter = "week",
}) => {
  const [dateFilter, setDateFilter] = useState(initialDateFilter);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredData = useMemo(() => {
    if (!data.length) return [];

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let startDate = new Date(now);

    switch (dateFilter) {
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

    return data.filter((item) => {
      const itemDate = new Date(item[dateKey]);
      itemDate.setHours(0, 0, 0, 0);

      // 📅 Date filter
      const inDateRange =
        itemDate >= startDate && itemDate <= now;

      // 🔍 Search filter
      const searchMatch =
        !search ||
        searchKeys.some((key) =>
          String(item[key] || "")
            .toLowerCase()
            .includes(search.toLowerCase())
        );

      // 🟡 Status filter
      const statusMatch =
        status === "all" || item[statusKey] === status;

      return inDateRange && searchMatch && statusMatch;
    });
  }, [data, dateFilter, search, status, dateKey, searchKeys, statusKey]);

  return {
    dateFilter,
    setDateFilter,
    search,
    setSearch,
    status,
    setStatus,
    filteredData,
  };
};