import { useEffect, useState } from "react";
import LineChart from "../../Charts/LineChart";
import FilterDropdown from "../../FilterDropdown";
import { useFilteredData } from "../../../hooks/useFilteredData";
import { getVisitorsChartData } from "../../../lib/analytics/chartQueries";

export default function VisitorsChart() {
  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const filterOptions = [
    { label: "Last 7 Days", value: "week" },
    { label: "Last 30 Days", value: "month" },
    { label: "Last 6 Months", value: "6months" },
    { label: "Last Year", value: "year" },
  ];

  useEffect(() => {
    async function fetchData() {
      const res = await getVisitorsChartData();

      setData(res || []);
    }

    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);

    fetchData();
  }, []);

  const { filter, setFilter, xLabels, series } = useFilteredData(
    data,
    "date",
    null,
    "visitors",
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
    <div className="w-full relative pt-16 min-h-105">
      <FilterDropdown
        value={filter}
        onChange={setFilter}
        options={filterOptions}
      />

      <LineChart
        title="Visitors"
        xLabels={xLabels}
        series={series}
        colorPalette={darkMode ? colorsDark : colorsLight}
        isDark={darkMode}
        showArea={false}
        smooth={false}
      />
    </div>
  );
}
