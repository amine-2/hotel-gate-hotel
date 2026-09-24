import { BedDouble } from "lucide-react";

const statusStyles = {
  occupied: {
    background: "bg-[#5E9E76]",
  },
  available: {
    background: "bg-[#577D8C]",
  },
  reserved: {
    background: "bg-[#D98353]",
  },
  inactive: {
    background: "bg-[#B85338]",
  },
};

export default function RoomCard({ room, status = "available", onClick }) {
  const styles = statusStyles[status] || statusStyles.available;

  const roomTypeName =
    room?.room_types?.name?.en || room?.room_type?.name?.en || "Room";

  return (
    <button
      type="button"
      onClick={() => onClick(room)}
      className={`
        group
        w-32.5
        min-w-32.5
        h-18
        rounded-xl
        ${styles.background}
        p-3
        text-left
        transition
        cursor-pointer hover:-translate-y-0.5 hover:shadow-md
      `}
    >
      <div className="flex items-start justify-between gap-2">
          <p className="truncate text-2xl font-semibold text-white ">
            {room.room_number}
          </p>
        <div className="min-w-0 flex flex-col items-end gap-2">
          <BedDouble size={16} className={`text-white shrink-0`} />

          <p className="mt-0.5 truncate text-[11px] text-white">
            {roomTypeName}
          </p>
        </div>
      </div>
    </button>
  );
}
