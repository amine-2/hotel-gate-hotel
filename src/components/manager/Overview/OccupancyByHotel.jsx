import { useState, useEffect } from "react";
import BarChart from "../../Charts/BarChart";
import FilterDropdown from "../../FilterDropdown";
import { useFilteredData } from "../../../hooks/useFilteredData";
import { getOccupancyByHotelData } from "../../../lib/statistics/occupancyByHotelData";
import LazyRender from "../../../hooks/LazyRender";
import { useTranslation } from "react-i18next";

export default function OccupancyByHotel() {

  const { t } = useTranslation(["common", "dashboard"]);
  

  const filterOptions = [
    { label: ` ${t("last_7_days", { ns: "common" })}`, value: "week" },
    { label: ` ${t("last_30_days", { ns: "common" })}`, value: "month" },
    { label: ` ${t("last_6_months", { ns: "common" })}`, value: "6months" },
    { label: ` ${t("last_year", { ns: "common" })}`, value: "year" },
  ];

  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  
  
 

  // ✅ Fetch async data HERE
  useEffect(() => {
    async function fetchData() {
      const res = await getOccupancyByHotelData();
      setData(res || []);
    }
     const isDark = localStorage.getItem("theme") === "dark";
      setDarkMode(isDark);

    fetchData();
  }, []);


  // ✅ Now pass DATA 
  const { filter, setFilter, xLabels, series } = useFilteredData(
    data,
    "date",
    "hotelName",
    "occupancy",
    "week"
  );

  const colorsLight = [
    "rgba(26, 70, 69 , 0.7)",
    "rgba(38, 104, 103, 0.7)",
    "rgba(245, 135, 0, 0.7)",
    "rgba(248, 188, 36, 0.7)",
  ];

  const colorsDark = [
    "rgba(251, 86, 7, 1)",
    "rgba(58, 134, 255, 1)",
    "rgba(131, 56, 236, 1)",
    "rgba(255, 0, 110, 1)",
  ];

  return (
    <LazyRender className="w-full relative pt-16 min-h-105 ">
      <FilterDropdown value={filter} onChange={setFilter} options={filterOptions} />

      {series.length > 0 && (
        <BarChart
          title={t("occupancyByHotel", { ns: "dashboard" })}
          xLabels={xLabels}
          series={series}
          colorPalette={darkMode ? colorsDark : colorsLight}
          isDark={darkMode}
        />
      )}
    </LazyRender>
  );
}