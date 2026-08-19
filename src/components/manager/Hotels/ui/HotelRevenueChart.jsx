import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LineChart from "../../../Charts/LineChart";
import FilterDropdown from "../../../FilterDropdown";
import { useFilteredData } from "../../../../hooks/useFilteredData";
import { getHotelStatsDaily } from "../../../../lib/statistics/getHotelStatsDaily";
import LazyRender from "../../../../hooks/LazyRender";

export default function HotelRevenueChart() {
  const { hotelId } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await getHotelStatsDaily(hotelId);

      const formatted = res.map((d) => ({
        date: d.date,
        total_revenue: d.total_revenue,
      }));

      setData(formatted);
    }

    if (hotelId) fetchData();
  }, [hotelId]);

  const filterOptions = [
    { label: "Last 7 Days", value: "week" },
    { label: "Last 30 Days", value: "month" },
    { label: "Last 6 Months", value: "6months" },
    { label: "Last Year", value: "year" },
  ];

  const { filter, setFilter, xLabels, series } = useFilteredData(
    data,
    "date",
    null,                // ✅ no grouping
    "total_revenue",     
    "week"
  );

  return (
    <LazyRender className="w-full relative pt-16 min-h-105">
      <FilterDropdown
        value={filter}
        onChange={setFilter}
        options={filterOptions}
      />

      <LineChart
        title="Revenue Over Time"
        xLabels={xLabels}
        series={series || []} 
        showArea={false}
        colorPalette={["rgba(245, 135, 0, 0.7)"]} 
        smooth={false}
      />
    </LazyRender>
  );
}