import EmployeeView from "../employees/EmployeeView";
import { useParams } from "react-router-dom";

export default function StaffView() {
  const { employeeId } = useParams();
  const EXCLUDED_ROLES = [
  "owner",
  "hr",
  "website_admin",
  "hotel_manager",
];

  return (
    <div className="p-14">

  <EmployeeView userId={employeeId} excluded={EXCLUDED_ROLES} />
  </div>
);}