import EmployeeView from "../../../employees/EmployeeView";
import { useParams } from "react-router-dom";

export default function StaffView() {
  const { employeeId } = useParams();

  return (
    <div className="p-14">
  <EmployeeView userId={employeeId} />
  </div>
);}