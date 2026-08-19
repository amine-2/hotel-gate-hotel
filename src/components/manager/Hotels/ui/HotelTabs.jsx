import { NavLink } from "react-router-dom";

export default function HotelTabs({ hotelId }) {
  const base = `/dashboard/owner/hotels/${hotelId}`;

  const tabs = [
    { name: "Details", path: "details" },
    { name: "Overview", path: "overview" },
    { name: "Bookings", path: "bookings" },
    { name: "Issues", path: "issues" },
    { name: "Settings", path: "settings" },
  ];

  return (
    <div className="flex gap-6 border-b border-zinc-500 mb-6">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={`${base}/${tab.path}`}
          className={({ isActive }) =>
            isActive
              ? "text-orange-400 border-b-2 border-orange-400 pb-2"
              : "text-zinc-400 pb-2"
          }
        >
          {tab.name}
        </NavLink>
      ))}
    </div>
  );
}