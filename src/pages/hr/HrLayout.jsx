import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Toaster } from "sonner";
import {
  LayoutDashboard,
  Building2,
  UserRoundCog,
  Settings,
  IdCardLanyard,
  TriangleAlert,
} from "lucide-react";

export default function HrLayout() {
  const hrLinks = [
    {
      label: "overview",
      exact: true,
      icon: LayoutDashboard,
      path: "/dashboard/hr/overview",
    },
    { label: "hotel", icon: Building2, path: "/dashboard/hr/hotel" },
    { label: "staff", icon: IdCardLanyard, path: "/dashboard/hr/staff" },
    { label: "issues", icon: TriangleAlert, path: "/dashboard/hr/issues" },
    { label: "settings", icon: Settings, path: "/dashboard/hr/settings" },
  ];
  return (
    <div className="flex flex-col h-screen">
      <Toaster richColors position="top-right" />

      <div className="flex w-screen">
        <Sidebar links={hrLinks} title="hrDashboard" />

        <main className="flex-1 p-8 ">
          <Outlet />
        </main>
      </div>
      <Navbar title="HR Dashbord" />
    </div>
  );
}
