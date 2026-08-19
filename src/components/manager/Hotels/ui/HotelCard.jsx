import { useNavigate } from "react-router-dom";
import hotelIcon from "../../../../assets/hotel-icon.svg";
import DarkHotelIcon from "../../../../assets/hotel-dark.svg";

export default function HotelCard({ hotel }) {
  const navigate = useNavigate();
  const isDark = localStorage.getItem("theme") === "dark";

  const getDisplayValue = (field) => {
    if (!field) return "—";
    return field.en || field.fr || field.ar || "—";
  };


  return (
    <div
      onClick={() => navigate(hotel.id)}
      className=" flex flex-col justify-center w-40 bg-white border border-zinc-300 rounded-2xl p-4 cursor-pointer hover:bg-zinc-100 transition dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700"
    >
      {/* Icon */}
      <div className="w-full h-20 flex items-center justify-center mb-3">
        <img src={hotelIcon} alt="Hotel" className="w-20 h-20 rounded-xl bg-zinc-300 flex items-center justify-center text-zinc-800 dark:text-zinc-300 dark:bg-zinc-600 dark:opacity-50" />
      </div>

      {/* Name */}
      <h2 className="text-zinc-800 text-sm font-medium truncate dark:text-zinc-300">
        {getDisplayValue(hotel.name)}
      </h2>

      {/* City */}
      <p className="text-zinc-500 text-xs mt-1 truncate dark:text-zinc-400">
        {getDisplayValue(hotel.location.city)}
      </p>
    </div>
  );
}