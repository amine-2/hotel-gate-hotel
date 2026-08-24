import { useEffect, useState } from "react";
import ReusableTable from "../../ReusableTable";
import TableFilters from "../../TableFilters";
import { useTableFilters } from "../../../hooks/useTableFilters";
import { getHotelBookings } from "../../../lib/bookings/getHotelBookings";
import {useHotel} from "../../../auth/HotelContext";

const columns = [
  { key: "id", label: "ID" , minWidth: "260px"   },
  { key: "name", label: "Guest", minWidth: "200px" },
  { key: "email", label: "Email", minWidth: "200px" },
  { key: "phone", label: "Phone", minWidth: "150px" },
  { key: "date", label: "Date", minWidth: "150px" },
  { key: "checkIn", label: "Check-In", minWidth: "150px" },
  { key: "checkOut", label: "Check-Out", minWidth: "150px" },
  { key: "status", label: "Status", minWidth: "150px", expandable: false },
];

export default function BookingsTable() {
  
  const [data, setData] = useState([]);
  const {hotelId} = useHotel();

  useEffect(() => {
    async function fetchData() {
      const res = await getHotelBookings(hotelId);
      

      const formatted = res.map((b) => ({
        id: b.id,
        name: b.name,
        email: b.email,
        phone: b.phone,
        rawDate: b.created_at,
        checkIn: new Date(b.check_in_date).toLocaleDateString(),
        checkOut: new Date(b.check_out_date).toLocaleDateString(),
        date: new Date(b.created_at).toLocaleDateString(),
        status: b.status,
      }));

      setData(formatted);
    }

    if (hotelId) fetchData();
  }, [hotelId]);

  const {
    dateFilter,
    setDateFilter,
    search,
    setSearch,
    status,
    setStatus,
    filteredData,
  } = useTableFilters({
    data,
    dateKey: "rawDate",
    searchKeys: ["name", "email", "id"],
    statusKey: "status",
  });

  return (
    <div className="w-[85%]  pt-16 ">
      <TableFilters
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        statusOptions={["confirmed", "pending", "cancelled"]}
      />

      <ReusableTable
        title="Bookings"
        columns={columns}
        data={filteredData}
      />
    </div>
  );
}