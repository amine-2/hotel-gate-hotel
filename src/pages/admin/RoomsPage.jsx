import { useEffect, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";

import { useHotel } from "../../auth/HotelContext";
import { getRoomTypes } from "../../lib/rooms/getRoomTypes";
import { deleteRoomType } from "../../lib/rooms/deleteRoomType";

import AddRoomTypeModal from "../../components/admin/Rooms/AddRoomTypeModal";
import EditRoomTypeModal from "../../components/admin/Rooms/EditRoomTypeModal";
import RoomTypeDetailsModal from "../../components/admin/Rooms/RoomTypeDetailsModal";
import RoomTypeCard from "../../components/admin/Rooms/RoomTypeCard";

export default function RoomsPage() {
  const { hotelId } = useHotel();

  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  async function loadRoomTypes() {
    if (!hotelId) return;

    setLoading(true);
    setError(null);

    const { data, error } = await getRoomTypes(hotelId);

    if (error) {
      console.error("Failed to load room types:", error);
      setError(error.message || "Failed to load room types.");
      setRoomTypes([]);
    } else {
      setRoomTypes(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadRoomTypes();
  }, [hotelId]);

  function handleView(roomType) {
    setSelectedRoomType(roomType);
    setShowDetails(true);
  }

  function handleEdit(roomType) {
    setSelectedRoomType(roomType);
    setShowEditModal(true);
  }

  async function handleDelete(roomType) {
    const name =
      roomType.name?.en ||
      roomType.name?.fr ||
      roomType.name?.ar ||
      "this room type";

    const roomCount = roomType.rooms?.length || 0;

    const message =
      roomCount > 0
        ? `Delete "${name}"?\n\n${roomCount} physical ${
            roomCount === 1 ? "room" : "rooms"
          } will become unassigned. The physical rooms themselves will NOT be deleted.`
        : `Delete "${name}"?`;

    const confirmed = window.confirm(message);

    if (!confirmed) return;

    setDeletingId(roomType.id);

    const { error } = await deleteRoomType(hotelId, roomType.id);

    if (error) {
      console.error("Failed to delete room type:", error);

      setError(error.message || "Failed to delete room type.");

      setDeletingId(null);
      return;
    }

    setRoomTypes((prev) => prev.filter((item) => item.id !== roomType.id));

    if (selectedRoomType?.id === roomType.id) {
      setSelectedRoomType(null);
      setShowDetails(false);
      setShowEditModal(false);
    }

    setDeletingId(null);
  }

  function handleRoomTypeCreated(newRoomType) {
    setRoomTypes((prev) => [
      {
        ...newRoomType,
        rooms: newRoomType.rooms || [],
      },
      ...prev,
    ]);

    setShowAddModal(false);
  }

  function handleRoomTypeUpdated(updatedRoomType) {
    setRoomTypes((prev) =>
      prev.map((item) =>
        item.id === updatedRoomType.id
          ? {
              ...item,
              ...updatedRoomType,

              // Editing the room type does not modify
              // its physical room assignments.
              rooms: item.rooms || [],
            }
          : item,
      ),
    );

    setShowEditModal(false);
    setSelectedRoomType(null);
  }

  function closeDetails() {
    setShowDetails(false);
    setSelectedRoomType(null);
  }

  function closeEdit() {
    setShowEditModal(false);
    setSelectedRoomType(null);
  }

  if (loading) {
    return (
      <div className="p-16">
        <div className="flex min-h-75 items-center justify-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Loading room types...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-16">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Rooms
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage room types and physical room assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium
           text-white transition hover:bg-gray-800 dark:bg-orange-500 dark:hover:bg-orange-400"
        >
          <Plus size={17} />
          Create Room Type
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Empty state */}
      {roomTypes.length === 0 ? (
        <div className="flex min-h-90 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <Plus size={22} className="text-gray-500" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              No room types yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Create your first room type, then assign your physical rooms to
              it.
            </p>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-orange-500 dark:hover:bg-orange-400"
            >
              <Plus size={17} />
              Create Room Type
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {roomTypes.map((roomType) => (
            <RoomTypeCard
              key={roomType.id}
              roomType={roomType}
              onView={() => handleView(roomType)}
              onEdit={() => handleEdit(roomType)}
              onDelete={() => handleDelete(roomType)}
              deleting={deletingId === roomType.id}
            />
          ))}
        </div>
      )}

      {/* Add Room Type */}
      {showAddModal && (
        <AddRoomTypeModal
          hotelId={hotelId}
          onClose={() => setShowAddModal(false)}
          onCreated={handleRoomTypeCreated}
        />
      )}

      {/* View Room Type */}
      {showDetails && selectedRoomType && (
        <RoomTypeDetailsModal
          roomType={selectedRoomType}
          onClose={closeDetails}
        />
      )}

      {/* Edit Room Type */}
      {showEditModal && selectedRoomType && (
        <EditRoomTypeModal
          hotelId={hotelId}
          roomType={selectedRoomType}
          onClose={closeEdit}
          onUpdated={async () => {
            await loadRoomTypes();
            setSelectedRoomType(null);
          }}
        />
      )}
    </div>
  );
}
