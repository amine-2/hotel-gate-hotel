import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees } from "../../../../lib/users/getEmployees";
import StaffSearch from "../ui/StaffSearch";
import RoleSection from "../ui/RoleSection";
import EmployeeCard from "../ui/EmployeeCard";
import {useHotel} from "../../../../auth/HotelContext";

export default function StaffBoardPage() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");



  const {hotelId} = useHotel();

  // 🔄 Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const data = await getEmployees(hotelId);
    setEmployees(data || []);
    setLoading(false);
  };

  // 🔍 FILTERING
  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    // search (name + id)
    if (search) {
      const s = search.toLowerCase();

      result = result.filter((e) => {
        const fullName = `${e.full_name}`.toLowerCase();

        return fullName.includes(s) || e.id?.toString().includes(search);
      });
    }

    return result;
  }, [employees,hotelId,  search]);

  const groupedByRole = useMemo(() => {
    const groups = {};

    filteredEmployees.forEach((emp) => {
      const roleName = emp.roleData?.name || "No Role";

      if (!groups[roleName]) {
        groups[roleName] = [];
      }

      groups[roleName].push(emp);
    });

    return groups;
  }, [filteredEmployees]);

  return (
    <div className="p-14">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-14 border-b border-gray-300 pb-7">
        <div className="flex gap-4 flex-wrap">
      

          <StaffSearch value={search} onChange={setSearch} />
        </div>

        <button
          onClick={() => navigate("add")}
          className="bg-zinc-900 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg 
          cursor-pointer transition dark:bg-orange-500 dark:hover:bg-orange-600"
        >
          + Add An Employee
        </button>
      </div>

      {/* LOADING */}
      {loading && <div className="text-zinc-400 text-sm">Loading staff...</div>}

      {/* CONTENT */}
      {!loading && (
        <>
          {/* 🧩 DEFAULT VIEW (GROUPED BY ROLE) */}
          {!search ? (
            Object.keys(groupedByRole).length > 0 ? (
              Object.entries(groupedByRole).map(([role, emps]) => (
                <RoleSection key={role} title={role}>
                  {emps.map((emp) => (
                    <EmployeeCard
                      key={emp.id}
                      employee={emp}
                      onClick={() => navigate(`${emp.id}`)}
                    />
                  ))}
                </RoleSection>
              ))
            ) : (
              <div className="text-zinc-500">No employees found.</div>
            )
          ) : /* 🔍 SEARCH MODE (FLAT) */
          filteredEmployees.length > 0 ? (
            <div className="w-full flex flex-wrap justify-start gap-4 p-6">
              {filteredEmployees.map((emp) => (
                <EmployeeCard
                  key={emp.id}
                  employee={emp}
                  onClick={() => navigate(`${emp.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-zinc-500">No results found.</div>
          )}
        </>
      )}
    </div>
  );
}
