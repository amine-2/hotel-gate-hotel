import { useEffect, useState } from "react";
import { useHotel } from "../../auth/HotelContext";

import { getHotelFloors } from "../../lib/rooms/getHotelFloors";

import AddFloorModal from "../../components/admin/Floors/AddFloorModal";
import FloorDetailsPage from "../../components/admin/Floors/FloorDetailsPage";

export default function FloorsPage() {
  const { hotelId } = useHotel();

  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedFloor, setSelectedFloor] = useState(null);

  async function loadFloors() {
    if (!hotelId) return;

    setLoading(true);
    setError(null);

    const { data, error } = await getHotelFloors(hotelId);

    if (error) {
      console.error("Failed to load hotel floors:", error);
      setError(error.message);
      setFloors([]);
    } else {
      setFloors(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadFloors();
  }, [hotelId]);

  function handleFloorCreated(newRooms) {
    const rooms = newRooms || [];

    if (rooms.length === 0) {
      setShowAddModal(false);
      return;
    }

    const createdFloor = rooms[0].floor;

    const newFloor = {
      floor: createdFloor,
      rooms,
    };

    setFloors((prev) => {
      const updated = [...prev, newFloor];

      return updated.sort(
        (a, b) => Number(a.floor) - Number(b.floor)
      );
    });

    setShowAddModal(false);
  }

  function handleOpenFloor(floor) {
    setSelectedFloor(floor);
  }

  function handleBackToFloors() {
    setSelectedFloor(null);

    // Refresh in case rooms were added/deleted
    // while viewing the floor.
    loadFloors();
  }

  /*
   * Show Floor Details instead of the floor list.
   */
  if (selectedFloor !== null) {
    return (
      <FloorDetailsPage
        floor={selectedFloor}
        onBack={handleBackToFloors}
      />
    );
  }

  if (loading) {
    return (
      <div className="p-16">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            Floors
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the physical floors and rooms in your hotel.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-8">
          <p className="text-sm text-gray-500">
            Loading floors...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-16">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Floors
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the physical floors and rooms in your hotel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setShowAddModal(true);
          }}
          className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-orange-500 dark:hover:bg-orange-600"
        >
          + Add Floor
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty State */}
      {floors.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <h2 className="text-lg font-medium">
            No floors yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Create your first floor and add its physical rooms.
            Room types can be assigned to rooms later.
          </p>

          <button
            type="button"
            onClick={() => {
              setError(null);
              setShowAddModal(true);
            }}
            className="mt-5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Add Floor
          </button>
        </div>
      ) : (
        /* Floors */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {floors.map((floor) => (
            <FloorCard
              key={floor.floor}
              floor={floor}
              onOpen={() =>
                handleOpenFloor(floor.floor)
              }
            />
          ))}
        </div>
      )}

      {/* Add Floor Modal */}
      {showAddModal && (
        <AddFloorModal
          hotelId={hotelId}
          existingFloors={floors}
          onClose={() => setShowAddModal(false)}
          onCreated={handleFloorCreated}
        />
      )}
    </div>
  );
}

function FloorCard({ floor, onOpen }) {
  const roomCount = floor.rooms?.length || 0;

  return (
    <div className="rounded-xl border bg-white p-5 transition hover:shadow-sm dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-300">
            Floor
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            {floor.floor}
          </h2>
        </div>

        <div className="rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {roomCount}
          </span>

          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
            {roomCount === 1 ? "room" : "rooms"}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t pt-4 dark:border-zinc-700">
        <button
          type="button"
          onClick={onOpen}
          className="text-sm font-medium text-gray-700 hover:text-black hover:underline dark:text-gray-200 dark:hover:text-white"
        >
          Manage Rooms →
        </button>
      </div>
    </div>
  );
}