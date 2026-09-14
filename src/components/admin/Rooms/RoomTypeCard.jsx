
import { Eye, Pencil, Trash2 } from "lucide-react";
import CardInfo from "./CardInfo";
export default function RoomTypeCard({
  roomType,
  onView,
  onEdit,
  onDelete,
  deleting,
}) {
  const name =
    roomType.name?.en ||
    roomType.name?.fr ||
    roomType.name?.ar ||
    "Unnamed Room Type";

  const roomCount = roomType.rooms?.length || 0;

  const isPublished = roomType.status === "published";

  const rooms = [...(roomType.rooms || [])].sort(
    (a, b) => {
      return (
        Number(a.floor || 0) - Number(b.floor || 0) ||
        String(a.room_number).localeCompare(
          String(b.room_number),
          undefined,
          { numeric: true }
        )
      );
    }
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      {/* Image */}
      {roomType.images?.length > 0 ? (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <img
            src={roomType.images[0]}
            alt={name}
            className="h-full w-full object-cover"
          />

          <div className="absolute left-3 top-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isPublished
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>

          {roomType.images.length > 1 && (
            <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
              +{roomType.images.length - 1} photos
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex h-48 items-center justify-center bg-gray-100">
          <span className="text-sm text-gray-400">
            No image
          </span>

          <div className="absolute left-3 top-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isPublished
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Title */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {name}
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {roomCount}{" "}
              {roomCount === 1 ? "physical room" : "physical rooms"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {roomType.price_per_night} DA
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              per night
            </p>
          </div>
        </div>

        {/* Basic information */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <CardInfo
            label="Capacity"
            value={`${roomType.capacity} ${
              roomType.capacity === 1
                ? "person"
                : "people"
            }`}
          />

          <CardInfo
            label="Size"
            value={`${roomType.size} m²`}
          />

          <CardInfo
            label="Rooms"
            value={roomCount}
          />
        </div>

        {/* Room numbers */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Assigned rooms
            </p>

            {roomCount > 0 && (
              <span className="text-xs text-gray-400">
                {roomCount} total
              </span>
            )}
          </div>

          {rooms.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 px-3 py-3">
              <p className="text-xs text-gray-400">
                No rooms assigned yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {rooms.slice(0, 12).map((room) => (
                <span
                  key={room.id}
                  className="rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                >
                  {room.room_number}
                </span>
              ))}

              {rooms.length > 12 && (
                <span className="rounded-md bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-400">
                  +{rooms.length - 12} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-zinc-700">
          <button
            type="button"
            onClick={onView}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:hover:bg-zinc-700 dark:border-zinc-700 dark:text-gray-300"
          >
            <Eye size={16} />
            View
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:hover:bg-zinc-700 dark:border-zinc-700 dark:text-gray-300"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-zinc-700 dark:border-zinc-700 dark:text-red-400   "
          >
            <Trash2 size={16} />

            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

