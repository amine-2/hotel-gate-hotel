import { useState, useEffect, useMemo } from "react";
import ReusableTable from "../../ReusableTable";
import LazyRender from "../../../hooks/Reveal";
import { getTodayOccupancyByHotel } from "../../../lib/statistics/todayOccupancyTableData";
import { useTranslation } from "react-i18next";

export default function OccupancyTableSection() {
  const [rows, setRows] = useState([]);
  const [footerRow, setFooterRow] = useState(null);

  const { t } = useTranslation(["common", "dashboard"]);

  // ✅ compute total row
  const computeTotalRow = (rows) => {
    if (!rows || !rows.length) return null;

    const totals = rows.reduce(
      (acc, row) => {
        acc.rooms += Number(row.rooms || 0);
        acc.occupied += Number(row.occupied || 0);
        acc.available += Number(row.available || 0);
        return acc;
      },
      { rooms: 0, occupied: 0, available: 0 }
    );

    const rate =
      totals.rooms > 0
        ? Math.round((totals.occupied / totals.rooms) * 100)
        : 0;

    return {
      id: "total",
      hotel: "Total",
      rooms: totals.rooms,
      occupied: totals.occupied,
      available: totals.available,
      rate,
    };
  };

  // ✅ columns INSIDE component (so t works)
  const columns = useMemo(() => [
    { key: "hotel", label: t("hotel", { ns: "dashboard" }) },

    { key: "rooms", label: t("rooms", { ns: "dashboard" }), align: "center" },

    { key: "occupied", label: t("occupied", { ns: "dashboard" }), align: "center" },

    { key: "available", label: t("available", { ns: "dashboard" }), align: "center" },

    {
      key: "rate",
      label: t("rate", { ns: "dashboard" }),
      align: "center",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.rate > 50
              ? "text-[#04610a] bg-[#d1fae5] dark:text-green-300 dark:bg-green-900"
              : "text-[#dc2626] bg-[#fee2e2] dark:text-red-300 dark:bg-red-900"
          }`}
        >
          {row.rate}%
        </span>
      ),
      exportValue: (row) => `${row.rate}%`,
    },
  ], [t]);

  useEffect(() => {
    async function fetchData() {
      const res = await getTodayOccupancyByHotel();

      setRows(res || []);
      setFooterRow(computeTotalRow(res || []));
    }

    fetchData();
  }, []);

  return (
    <LazyRender className="w-full relative pt-16 min-h-105">
      <ReusableTable
        title={t("todaysOccupancy", { ns: "dashboard" })}
        columns={columns}
        data={rows}
        footerRow={footerRow}
        rowClass={(row) =>
          row.id === "total" ? "font-bold bg-zinc-100" : ""
        }
      />
    </LazyRender>
  );
}