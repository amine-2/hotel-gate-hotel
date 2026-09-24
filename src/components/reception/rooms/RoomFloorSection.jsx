import { ChevronDown } from "lucide-react";
import RoomCard from "./RoomCard";

export default function RoomFloorSection({
  floor,
  rooms,
  isOpen,
  onToggle,
  getRoomStatus,
  onRoomClick,
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <div className="text-left">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {floor === null ? "Unassigned Floor" : `Floor ${floor}`}
            </h2>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
            </p>
          </div>
        </div>

        <ChevronDown
          size={18}
          className={`
            text-zinc-500
            transition-transform
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {isOpen && (
        <div className="border-t border-zinc-100 px-4 py-4 dark:border-zinc-800">
          <div className="flex flex-wrap gap-3">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                status={getRoomStatus(room)}
                onClick={onRoomClick}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}