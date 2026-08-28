import StaffBoardPage from "../../components/hr/Staff/views/StaffBoardPage";
import AddStaff from "../../components/hr/Staff/views/AddStaff";
import StaffView from "../../components/hr/Staff/views/StaffView";
import { Routes, Route } from "react-router-dom";

export default function HrStaff() {
  return (
    <Routes>
      {/* LIST */}
      <Route index element={<StaffBoardPage />} />

      {/* ADD */}
      <Route path="add" element={<AddStaff />} />

      {/* VIEW */}
      <Route path=":employeeId" element={<StaffView />} />
    </Routes>
  );
}