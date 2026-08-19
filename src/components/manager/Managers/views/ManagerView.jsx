import { useParams } from "react-router-dom";
import EmployeeView from "../../../employees/EmployeeView";

export default function ManagerView() {
  const { managerId } = useParams();

  return (
    <div className="p-14">
  <EmployeeView userId={managerId} />
  </div>
);
}