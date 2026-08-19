import StaffBoardPage from "../../components/manager/Staff/views/StaffBoardPage";
import AddStaff from "../../components/manager/Staff/views/AddStaff";
import StaffView from "../../components/manager/Staff/views/StaffView";
import { Routes, Route } from "react-router-dom";

export default function Staff() {
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