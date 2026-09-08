import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";

import { getUnassignedRooms } from "../../../lib/rooms/getUnassignedRooms";
import { assignRoomsToRoomType } from "../../../lib/rooms/assignRoomsToRoomType";

export default function AddRoomsToRoomTypeModal({
  hotelId,
  roomTypeId,
  onClose,
  onAdded,
}) {
  const [rooms, setRooms] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadRooms() {
    setLoading(true);
    setError("");

    const { data, error } =
      await getUnassignedRooms(hotelId);

    if (error) {
      console.error(
        "Failed to load unassigned rooms:",
        error
      );

      setError(
        error.message ||
          "Failed to load available rooms."
      );

      setRooms([]);
    } else {
      setRooms(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadRooms();
  }, [hotelId]);

  function toggleRoom(roomId) {
    setSelectedIds((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  }

  function selectAll() {
    setSelectedIds(
      filteredRooms.map((room) => room.id)
    );
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  async function handleAdd() {
    if (selectedIds.length === 0) {
      setError("Select at least one room.");
      return;
    }

    setSaving(true);
    setError("");

    const { data, error } =
      await assignRoomsToRoomType(
        hotelId,
        roomTypeId,
        selectedIds
      );

    if (error) {
      console.error(
        "Failed to assign rooms:",
        error
      );

      setError(
        error.message ||
          "Failed to assign rooms."
      );

      setSaving(false);
      return;
    }

    onAdded?.(data || []);

    setSaving(false);
  }

  const filteredRooms = rooms.filter((room) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      String(room.room_number)
        .toLowerCase()
        .includes(query) ||
      String(room.floor ?? "")
        .toLowerCase()
        .includes(query)
    );
  });

  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative z-111 flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Add Rooms
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select physical rooms to assign to
              this room type.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}

        <div className="space-y-3 border-b px-6 py-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search room number or floor..."
              disabled={saving}
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {selectedIds.length} selected ·{" "}
              {filteredRooms.length} available
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={selectAll}
                disabled={
                  saving ||
                  filteredRooms.length === 0
                }
                className="text-xs font-medium text-gray-700 hover:underline disabled:opacity-40"
              >
                Select all
              </button>

              <button
                type="button"
                onClick={clearSelection}
                disabled={
                  saving ||
                  selectedIds.length === 0
                }
                className="text-xs font-medium text-gray-500 hover:underline disabled:opacity-40"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Rooms */}

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex min-h-60 items-center justify-center">
              <p className="text-sm text-gray-500">
                Loading available rooms...
              </p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="flex min-h-60 items-center justify-center rounded-xl border border-dashed border-gray-300">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  {rooms.length === 0
                    ? "No unassigned rooms"
                    : "No rooms found"}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {rooms.length === 0
                    ? "Create physical rooms from the Floors page first."
                    : "Try a different search."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filteredRooms.map((room) => {
                const selected =
                  selectedIds.includes(room.id);

                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() =>
                      toggleRoom(room.id)
                    }
                    disabled={saving}
                    className={`rounded-xl border p-3 text-left transition ${
                      selected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {room.room_number}
                      </span>

                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                          selected
                            ? "border-white bg-white text-gray-900"
                            : "border-gray-300"
                        }`}
                      >
                        {selected ? "✓" : ""}
                      </span>
                    </div>

                    {room.floor !== null &&
                      room.floor !== undefined && (
                        <p
                          className={`mt-1 text-xs ${
                            selected
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          Floor {room.floor}
                        </p>
                      )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="flex items-center justify-between border-t px-6 py-4">
          <p className="text-xs text-gray-500">
            {selectedIds.length > 0
              ? `${selectedIds.length} ${
                  selectedIds.length === 1
                    ? "room"
                    : "rooms"
                } selected`
              : "No rooms selected"}
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleAdd}
              disabled={
                saving ||
                selectedIds.length === 0
              }
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Adding..."
                : "Add Rooms"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}