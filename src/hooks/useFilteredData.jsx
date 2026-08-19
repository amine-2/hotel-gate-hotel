import { useState, useMemo } from "react";

export const useFilteredData = (
  data,
  dateKey,
  groupByKey,
  valueKey,
  initialFilter = "week"
) => {
  const [filter, setFilter] = useState(initialFilter);

  const { xLabels, series } = useMemo(() => {
    if (!data || !data.length) {
      return { xLabels: [], series: [] };
    }

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

    const normalizeDate = (dateStr) => {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const startKey = normalizeDate(startDate);
    const endKey = normalizeDate(now);

    const filtered = data.filter((d) => {
      const key = normalizeDate(d[dateKey]);
      return key >= startKey && key <= endKey;
    });

    // 🧱 Build x-axis
    const xAxis = [];

    if (filter === "week" || filter === "month") {
      const days =
        Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;

      for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);

        const key = normalizeDate(d);
        const label = d.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        });

        xAxis.push({ key, label });
      }
    } else {
      const d = new Date(startDate);

      while (d <= now) {
        const key = `${d.getFullYear()}-${String(
          d.getMonth() + 1
        ).padStart(2, "0")}`;

        const label = d.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        xAxis.push({ key, label });
        d.setMonth(d.getMonth() + 1);
      }
    }

    // ✅ NO GROUP (single series)
    if (!groupByKey) {
      const lookup = {};

      filtered.forEach((d) => {
        let key;

        if (filter === "week" || filter === "month") {
          key = normalizeDate(d[dateKey]);
        } else {
          const dateObj = new Date(d[dateKey]);
          key = `${dateObj.getFullYear()}-${String(
            dateObj.getMonth() + 1
          ).padStart(2, "0")}`;
        }

        if (!lookup[key]) lookup[key] = 0;
        lookup[key] += Number(d[valueKey] || 0);
      });

      return {
        xLabels: xAxis.map((x) => x.label),
        series: [
          {
            name: "Revenue",
            data: xAxis.map((x) => lookup[x.key] || 0),
          },
        ],
      };
    }

    // ✅ GROUP MODE
    const map = {};

    filtered.forEach((d) => {
      const group = d[groupByKey];

      let key;
      if (filter === "week" || filter === "month") {
        key = normalizeDate(d[dateKey]);
      } else {
        const dateObj = new Date(d[dateKey]);
        key = `${dateObj.getFullYear()}-${String(
          dateObj.getMonth() + 1
        ).padStart(2, "0")}`;
      }

      if (!map[group]) map[group] = {};
      if (!map[group][key]) map[group][key] = 0;

      map[group][key] += Number(d[valueKey] || 0);
    });

    const series = Object.keys(map).map((group) => ({
      name: group,
      data: xAxis.map((x) => map[group][x.key] || 0),
    }));

    return {
      xLabels: xAxis.map((x) => x.label),
      series,
    };
  }, [data, dateKey, groupByKey, valueKey, filter]);

  return { filter, setFilter, xLabels, series };
};