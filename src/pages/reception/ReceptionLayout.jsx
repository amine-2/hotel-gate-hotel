import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Toaster } from "sonner";
import {
  LayoutDashboard,
  BookOpenCheck ,
  BedDouble,
  FileClock,
  Settings,
  MonitorCheck,
  TriangleAlert,

} from "lucide-react";

export default function ReceptionLayout() {
  const ReceptionLinks = [
    {
      label: "overview",
      exact: true,
      icon: LayoutDashboard,
      path: "/dashboard/reception/overview",
    },
    { label: "Reservations", icon: BookOpenCheck, path: "/dashboard/reception/reservations" },
    { label: "frontdesk", icon: MonitorCheck, path: "/dashboard/reception/frontdesk" },
    {
      label: "rooms",
      icon: BedDouble,
      path: "/dashboard/reception/rooms",
    },
    {
      label: "Stay history",
      icon: FileClock,
      path: "/dashboard/reception/stay-history",
    },
    {
      label: "issues",
      icon: TriangleAlert,
      path: "/dashboard/reception/issues",
    },
    {
      label: "settings",
      icon: Settings,
      path: "/dashboard/reception/settings",
    },
  ];
  return (
    <div className="flex flex-col h-screen">
      <Toaster richColors position="top-right" />

      <div className="flex w-screen">
        <Sidebar links={ReceptionLinks} title="receptionDashboard" />

        <main className="flex-1 p-8 ">
          <Outlet />
        </main>
      </div>
      <Navbar title="Reception Dashboard" />
    </div>
  );
}
