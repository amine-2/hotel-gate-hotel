import { useState } from "react";
import { addRoomsToFloor } from "../../../lib/rooms/addRoomsToFloor";

export default function AddRoomsModal({
  hotelId,
  floor,
  existingRooms = [],
  onClose,
  onCreated,
}) {
  const [mode, setMode] = useState("range");

  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  const [specificRooms, setSpecificRooms] = useState([""]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleRoomChange(index, value) {
    setSpecificRooms((prev) =>
      prev.map((room, i) => (i === index ? value : room)),
    );
  }

  function addRoomInput() {
    setSpecificRooms((prev) => [...prev, ""]);
  }

  function removeRoomInput(index) {
    setSpecificRooms((prev) => prev.filter((_, i) => i !== index));
  }

  function getRangeRooms() {
    const from = Number(rangeFrom);
    const to = Number(rangeTo);

    if (!Number.isInteger(from) || !Number.isInteger(to)) {
      return {
        rooms: [],
        error: "Both range values must be whole numbers.",
      };
    }

    if (from > to) {
      return {
        rooms: [],
        error: "The starting room must be less than the ending room.",
      };
    }

    const count = to - from + 1;

    if (count > 500) {
      return {
        rooms: [],
        error: "You cannot create more than 500 rooms at once.",
      };
    }

    const rooms = [];

    for (let number = from; number <= to; number++) {
      rooms.push(String(number));
    }

    return {
      rooms,
      error: null,
    };
  }

  function getSpecificRoomList() {
    const rooms = specificRooms.map((room) => room.trim()).filter(Boolean);

    if (rooms.length === 0) {
      return {
        rooms: [],
        error: "Add at least one room.",
      };
    }

    const uniqueRooms = new Set(rooms);

    if (uniqueRooms.size !== rooms.length) {
      return {
        rooms: [],
        error: "You cannot add the same room number more than once.",
      };
    }

    if (rooms.length > 500) {
      return {
        rooms: [],
        error: "You cannot add more than 500 rooms at once.",
      };
    }

    return {
      rooms,
      error: null,
    };
  }

  async function handleSubmit() {
    setError(null);

    let rooms = [];

    if (mode === "range") {
      const result = getRangeRooms();

      if (result.error) {
        setError(result.error);
        return;
      }

      rooms = result.rooms;
    } else {
      const result = getSpecificRoomList();

      if (result.error) {
        setError(result.error);
        return;
      }

      rooms = result.rooms;
    }

    const existingNumbers = new Set(
      existingRooms.map((room) => String(room.room_number).trim()),
    );

    const duplicateRooms = rooms.filter((room) => existingNumbers.has(room));

    if (duplicateRooms.length > 0) {
      setError(`These rooms already exist: ${duplicateRooms.join(", ")}`);
      return;
    }

    setSaving(true);

    const { data, error } = await addRoomsToFloor(hotelId, floor, rooms);

    if (error) {
      console.error("Failed to add rooms:", error);

      if (error.code === "23505") {
        setError("One or more room numbers already exist in this hotel.");
      } else {
        setError(error.message);
      }

      setSaving(false);
      return;
    }

    onCreated?.(data);
  }

  const previewCount =
    mode === "range"
      ? (() => {
          const from = Number(rangeFrom);
          const to = Number(rangeTo);

          if (Number.isInteger(from) && Number.isInteger(to) && to >= from) {
            return to - from + 1;
          }

          return 0;
        })()
      : specificRooms.filter((room) => room.trim()).length;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative z-101 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-800"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Add Rooms</h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add physical rooms to Floor {floor}.
          </p>
        </div>

        <div className="space-y-6">
          {/* Mode */}
          <div>
            <label className="mb-2 block text-sm font-medium">Add Rooms</label>

            <div className="grid grid-cols-2 rounded-lg border p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("range");
                  setError(null);
                }}
                disabled={saving}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  mode === "range"
                    ? "bg-black text-white dark:bg-orange-500"
                    : "text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-gray-300"
                }`}
              >
                Room Range
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("specific");
                  setError(null);
                }}
                disabled={saving}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  mode === "specific"
                    ? "bg-black text-white dark:bg-orange-500"
                    : "text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-gray-300"
                }`}
              >
                Specific Rooms
              </button>
            </div>
          </div>

          {/* Range */}
          {mode === "range" && (
            <div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                <div>
                  <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400 ">
                    From
                  </label>

                  <input
                    type="number"
                    value={rangeFrom}
                    onChange={(e) => setRangeFrom(e.target.value)}
                    placeholder={`${floor}01`}
                    disabled={saving}
                    autoFocus
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black dark:text-gray-400 dark:focus:border-zinc-300" 
                  />
                </div>

                <span className="pb-2 text-gray-400 dark:text-gray-300">→</span>

                <div>
                  <label className="dark:text-gray-400">To</label>

                  <input
                    type="number"
                    value={rangeTo}
                    onChange={(e) => setRangeTo(e.target.value)}
                    placeholder={`${floor}20`}
                    disabled={saving}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black dark:text-gray-400 dark:focus:border-zinc-300"
                  />
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-400 dark:text-gray-300">
                Example: {floor}01 → {floor}20
              </p>
            </div>
          )}

          {/* Specific */}
          {mode === "specific" && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-gray-600 dark:text-gray-400">Room Numbers</label>

                <span className="text-xs text-gray-400 dark:text-gray-300">
                  {previewCount} {previewCount === 1 ? "room" : "rooms"}
                </span>
              </div>

              <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                {specificRooms.map((room, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={room}
                      onChange={(e) => handleRoomChange(index, e.target.value)}
                      placeholder={`${floor}01`}
                      disabled={saving}
                      autoFocus={index === 0}
                      className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-black dark:text-gray-400 dark:focus:border-zinc-300"
                    />

                    {specificRooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoomInput(index)}
                        disabled={saving}
                        className="rounded-lg border px-3 text-lg text-gray-400 hover:border-red-200 hover:text-red-500"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addRoomInput}
                disabled={saving || specificRooms.length >= 500}
                className="mt-3 text-sm font-medium hover:underline disabled:opacity-50"
              >
                + Add another room
              </button>
            </div>
          )}

          {/* Preview */}
          {previewCount > 0 && (
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-zinc-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{previewCount}</span>{" "}
                {previewCount === 1 ? "room" : "rooms"} will be added to Floor{" "}
                <span className="font-medium">{floor}</span>.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                saving ||
                (mode === "range"
                  ? !rangeFrom || !rangeTo
                  : !specificRooms.some((room) => room.trim()))
              }
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Rooms"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
