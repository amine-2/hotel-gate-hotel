import avataPlaceholder from "../../../../assets/avatar-placeholder.png";

export default function ManagerCard({ manager, hotelName }) {
  return (
    <div className="bg-white hover:bg-gray-100 transition rounded-2xl p-4 shadow dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer">
      {/* TOP */}
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-lg font-semibold">{manager.full_name}</h2>

        <img
          src={manager.avatar_url || avataPlaceholder}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover"
        />

        <p className="text-sm text-zinc-400">
          {hotelName || "No hotel assigned"}
        </p>
      </div>

      {/* STATUS (optional but useful) */}
      <div className="mt-3">
        <span className={`text-xs ${manager.status === "active" ? "text-green-500" : "text-zinc-500"} `}>
          {manager.status}
        </span>
      </div>
    </div>
  );
}
