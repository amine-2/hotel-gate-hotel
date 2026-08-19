import { useState } from "react";
import { NavLink } from "react-router-dom";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Sidebar({
  links = [],
  title = "",
  defaultPinned = false,
}) {
  const [collapsed, setCollapsed] = useState(true);
  const [pinned, setPinned] = useState(defaultPinned);

  const isOpen = !collapsed || pinned;
  const { t } = useTranslation("sidebar");
  return (
    <div
      onMouseEnter={() => !pinned && setCollapsed(false)}
      onMouseLeave={() => !pinned && setCollapsed(true)}
      className={`
        fixed left-0 top-0
        h-screen bg-zinc-900 text-white
        transition-all duration-300
        ${isOpen ? "w-60" : "w-16"}
        flex flex-col border-r border-zinc-800
        pt-16
        z-50
      `}
    >
      {/* Top */}
      <div className="flex items-center justify-between p-4 overflow-x-hidden">
        {isOpen && (
          <span className="text-sm font-semibold whitespace-nowrap">{t(title)}</span>
        )}

        <div
          onClick={() => {
            setPinned(!pinned);
            setCollapsed(pinned);
          }}
          className="p-2 rounded-lg hover:bg-zinc-800 cursor-pointer"
        >
          {isOpen ? (
            <PanelLeftClose
              size={20}
              className={pinned ? "text-orange-300" : "text-zinc-400"}
            />
          ) : (
            <PanelLeftOpen size={20} className="text-zinc-400" />
          )}
        </div>
      </div>

      {/* Links */}
      <div className="flex-1 space-y-1 px-2">
        {links.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `
                flex items-center gap-3 p-3 rounded-lg
                transition
                ${
                  isActive
                    ? "bg-zinc-800 text-orange-300"
                    : "hover:bg-zinc-800 text-zinc-400"
                }
              `
              }
            >
              <Icon size={20} />
              {isOpen && (
                <span className="text-sm font-medium">
                  {t(item.label)}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}