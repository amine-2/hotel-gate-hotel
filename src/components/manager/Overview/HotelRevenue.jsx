import { useEffect, useState } from "react";
import BarChart from "../../Charts/BarChart";
import FilterDropdown from "../../FilterDropdown";
import { useFilteredData } from "../../../hooks/useFilteredData";
import { getHotelRevenue } from "../../../lib/statistics/hotelRevenue";
import { useHotel } from "../../../auth/HotelContext";
import LazyRender from "../../../hooks/LazyRender";
import { useTranslation } from "react-i18next";

export default function HotelRevenue() {
  const { t } = useTranslation(["common", "dashboard"]);
  const [revenueData, setRevenueData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const { hotelId } = useHotel();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getHotelRevenue(hotelId);
      setRevenueData(res);
    };

    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    fetchData();
  }, [hotelId]);

  const filterOptions = [
    { label: t("last_7_days", { ns: "common" }), value: "week" },
    { label: t("last_30_days", { ns: "common" }), value: "month" },
    { label: t("last_6_months", { ns: "common" }), value: "6months" },
    { label: t("last_year", { ns: "common" }), value: "year" },
  ];

  const { filter, setFilter, xLabels, series } = useFilteredData(
    revenueData,
    "date", // date field
    "hotelName", // group by hotel
    "revenue", // value to sum
    "week",
  );

  const colorsLight = [
    "rgba(245, 135, 0, 0.7)",
    "rgba(38, 104, 103, 0.7)",
    "rgba(26, 70, 69 , 0.7)",
    "rgba(248, 188, 36, 0.7)",
  ];

  const colorsDark = [
    "rgba(131, 56, 236, 1)",
    "rgba(58, 134, 255, 1)",
    "rgba(251, 86, 7, 1)",
    "rgba(255, 0, 110, 1)",
  ];

  return (
    <LazyRender className="w-full relative pt-16 min-h-105">
      <FilterDropdown
        value={filter}
        onChange={setFilter}
        options={filterOptions}
      />
      <BarChart
        title={t("hotelRevenue", { ns: "dashboard" })}
        xLabels={xLabels}
        series={series}
        colorPalette={darkMode ? colorsDark : colorsLight}
        isDark={darkMode}
      />
    </LazyRender>
  );
}
