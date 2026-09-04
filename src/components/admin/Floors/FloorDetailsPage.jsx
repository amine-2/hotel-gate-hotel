import { useEffect, useState } from "react";
import { useHotel } from "../../../auth/HotelContext";

import { getFloorRooms } from "../../../lib/rooms/getFloorRooms";
import { deleteRoom } from "../../../lib/rooms/deleteRoom";

import AddRoomsModal from "../../../components/admin/Floors/AddRoomsModal";

export default function FloorDetailsPage({
  floor,
  onBack,
}) {
  const { hotelId } = useHotel();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [deletingRoomId, setDeletingRoomId] =
    useState(null);

  async function loadRooms() {
    if (!hotelId) return;

    setLoading(true);
    setError(null);

    const { data, error } = await getFloorRooms(
      hotelId,
      floor
    );

    if (error) {
      console.error(
        "Failed to load floor rooms:",
        error
      );

      setError(error.message);
    } else {
      setRooms(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadRooms();
  }, [hotelId, floor]);

  async function handleDeleteRoom(room) {
    const confirmed = window.confirm(
      `Are you sure you want to delete room ${room.room_number}?`
    );

    if (!confirmed) return;

    setDeletingRoomId(room.id);
    setError(null);

    const { error } = await deleteRoom(
      hotelId,
      room.id
    );

    if (error) {
      console.error(
        "Failed to delete room:",
        error
      );

      setError(error.message);
      setDeletingRoomId(null);
      return;
    }

    setRooms((prev) =>
      prev.filter((item) => item.id !== room.id)
    );

    setDeletingRoomId(null);
  }

  function handleRoomsCreated(newRooms) {
    setRooms((prev) =>
      [...prev, ...(newRooms || [])].sort((a, b) =>
        String(a.room_number).localeCompare(
          String(b.room_number),
          undefined,
          { numeric: true }
        )
      )
    );

    setShowAddModal(false);
  }

  if (loading) {
    return (
      <div className="p-16">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-sm text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          ← Back to Floors
        </button>

        <h1 className="text-2xl font-semibold">
          Floor {floor}
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Loading rooms...
        </p>
      </div>
    );
  }

  return (
    <div className="p-16">
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 text-sm text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          ← Back to Floors
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Floor {floor}
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {rooms.length}{" "}
              {rooms.length === 1
                ? "room"
                : "rooms"}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowAddModal(true)
            }
            className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-orange-500 dark:hover:bg-orange-600"
          >
            + Add Rooms
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Rooms */}
      {rooms.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center dark:bg-zinc-800">
          <h2 className="text-lg font-medium">
            No rooms on this floor
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Add the physical rooms for this floor.
          </p>

          <button
            type="button"
            onClick={() =>
              setShowAddModal(true)
            }
            className="mt-5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white dark:bg-orange-500 dark:hover:bg-orange-600"
          >
            + Add Rooms
          </button>
        </div>
      ) : (
        <div className="rounded-xl border bg-white dark:bg-zinc-800 dark:border-zinc-700">
          <div className="border-b px-6 py-4">
            <h2 className="font-medium">
              Physical Rooms
            </h2>
          </div>

          <div className="divide-y">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div>
                  <p className="font-medium">
                    Room {room.room_number}
                  </p>

                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-300">
                    {room.room_type_id
                      ? "Room type assigned"
                      : "No room type assigned"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteRoom(room)
                  }
                  disabled={
                    deletingRoomId === room.id
                  }
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingRoomId === room.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Rooms Modal */}
      {showAddModal && (
        <AddRoomsModal
          hotelId={hotelId}
          floor={floor}
          existingRooms={rooms}
          onClose={() =>
            setShowAddModal(false)
          }
          onCreated={handleRoomsCreated}
        />
      )}
    </div>
  );
}