import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Toaster } from "sonner";
import {
  LayoutDashboard,
  Settings,
  TriangleAlert,
  Building2,
} from "lucide-react";

export default function AdminLayout() {
  const websiteManagerLinks = [
    {
      label: "hotel",
      exact: true,
      icon: Building2,
      path: "/dashboard/admin/hotel",
    },
    {
      label: "issues",
      icon: TriangleAlert,
      path: "/dashboard/admin/issues",
    },
    {
      label: "settings",
      icon: Settings,
      path: "/dashboard/admin/settings",
    },
  ];
  return (
    <div className="flex flex-col h-screen">
      <Toaster richColors position="top-right" />
      <div className="flex w-screen ">
        <Sidebar links={websiteManagerLinks} title="adminDashboard" />

        <main className="flex-1 p-8 ">
          <Outlet />
        </main>
      </div>
      <Navbar title="Website Admin Dashboard" />
    </div>
  );
}
