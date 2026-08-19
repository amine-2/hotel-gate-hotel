import { useState, useEffect } from "react";
import AreaChart from "../../Charts/AreaChart";
import FilterDropdown from "../../FilterDropdown";
import { useFilteredData } from "../../../hooks/useFilteredData";
import { getRevenueByChannelData } from "../../../lib/statistics/revenueByChannelData";
import LazyRender from "../../../hooks/LazyRender";
import { useTranslation } from "react-i18next";

export default function RevenueByChannel() {
  const [channelData, setChannelData] = useState([]);
  const { t } = useTranslation(["common", "dashboard"]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await getRevenueByChannelData();
      setChannelData(res || []);

      
    }
    
    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    fetchData();
  }, []);

  const filterOptions = [
    { label: t("last_7_days", { ns: "common" }), value: "week" },
    { label: t("last_30_days", { ns: "common" }), value: "month" },
    { label: t("last_6_months", { ns: "common" }), value: "6months" },
    { label: t("last_year", { ns: "common" }), value: "year" },
  ];
  const { filter, setFilter, xLabels, series } = useFilteredData(
    channelData,
    "date",
    "channel",
    "revenue",
    "week",
  );

  const colorsLight = [
    "rgba(26, 70, 69 , 0.7)",
    "rgba(38, 104, 103, 0.7)",
    "rgba(245, 135, 0, 0.7)",
    "rgba(248, 188, 36, 0.7)",
  ];

  const colorsDark = [
    "rgba(251, 86, 7, 0.7)",
    "rgba(58, 134, 255, 0.7)",
    "rgba(131, 56, 236, 0.7)",
    "rgba(255, 0, 110, 0.7)",
  ];

  return (
    <LazyRender className="w-full relative pt-16 min-h-105">
      <FilterDropdown
        value={filter}
        onChange={setFilter}
        options={filterOptions}
      />
      <AreaChart
        title={t("revenueByChannel", { ns: "dashboard" })}
        xLabels={xLabels}
        series={series}
        colorPalette={darkMode ? colorsDark : colorsLight}
        isDark={darkMode}
      />
    </LazyRender>
  );
}
