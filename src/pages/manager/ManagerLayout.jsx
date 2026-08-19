import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Toaster } from "sonner"; 
import {
  LayoutDashboard,
  Building2,
  Settings,
  IdCardLanyard,
  TriangleAlert,
} from "lucide-react";

export default function ManagerLayout() {
  const managerLinks = [
    {
      label: "overview",
      exact: true,
      icon: LayoutDashboard,
      path: "/dashboard/manager/overview",
    },
    { label: "hotel", icon: Building2, path: "/dashboard/manager/hotel" },
    { label: "staff", icon: IdCardLanyard, path: "/dashboard/manager/staff" },
    { label: "issues", icon: TriangleAlert, path: "/dashboard/manager/issues" },
    { label: "settings", icon: Settings, path: "/dashboard/manager/settings" },
  ];
  return (
    <div className="flex flex-col h-screen">
      <Toaster richColors position="top-right" />

      <div className="flex w-screen">
        <Sidebar links={managerLinks} title="managerDashboard" />

        <main className="flex-1 p-8 ">
          <Outlet />
        </main>
      </div>
      <Navbar title="Manager Dashbord" />
    </div>
  );
}
