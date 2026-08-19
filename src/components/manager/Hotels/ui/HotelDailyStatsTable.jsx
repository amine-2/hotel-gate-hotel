import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReusableTable from "../../../ReusableTable";
import LazyRender from "../../../../hooks/Reveal";
import FilterDropdown from "../../../FilterDropdown";
import { useDateFilter } from "../../../../hooks/useDateFilter";
import { getHotelStatsDaily } from "../../../../lib/statistics/getHotelStatsDaily";

// ✅ columns
const columns = [
  { key: "date", label: "Date" },

  {
    key: "revenue",
    label: "Revenue",
    align: "center",
  },

  {
    key: "bookings",
    label: "Bookings",
    align: "center",
  },

  {
    key: "guests",
    label: "Guests",
    align: "center",
  },
    {
    key: "rooms",
    label: "Rooms",
    align: "center",
  },
    {
    key: "occupancy",
    label: "Occupancy",
    align: "center",
  },
    {
    key: "empty",
    label: "Empty Rooms",
    align: "center",
  }
  
];

export default function HotelDailyStatsTable() {
  const { hotelId } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await getHotelStatsDaily(hotelId);

      const formatted = res.map((d) => ({
        id: d.date,
        date: new Date(d.date).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        }),
        rawDate: d.date,
        revenue: d.total_revenue,
        bookings: d.total_bookings,
        guests: d.guests,
        rooms: d.total_rooms,
        occupancy: d.occupied_rooms,
        empty: d.empty_rooms,
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

  // ✅ PURE TABLE FILTER HOOK
  const { filter, setFilter, filteredData } = useDateFilter(
    data,
    "rawDate",
    "week",
  );

  return (
    <LazyRender className="w-full pt-16 min-h-105">
      <div className=" w-1/3 flex  relative mb-4">
 
        <FilterDropdown
          value={filter}
          onChange={setFilter}
          options={filterOptions}
        />
      </div>

      <ReusableTable
        title="Hotel Daily Stats"
        columns={columns}
        data={filteredData}
      />
    </LazyRender>
  );
}
