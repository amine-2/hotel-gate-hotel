import { useEffect, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";

import { useHotel } from "../../auth/HotelContext";
import { getRoomTypes } from "../../lib/rooms/getRoomTypes";
import { deleteRoomType } from "../../lib/rooms/deleteRoomType";

import AddRoomTypeModal from "../../components/admin/Rooms/AddRoomTypeModal";
import EditRoomTypeModal from "../../components/admin/Rooms/EditRoomTypeModal";
import RoomTypeDetailsModal from "../../components/admin/Rooms/RoomTypeDetailsModal";

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

    const { error } = await deleteRoomType(
      hotelId,
      roomType.id
    );

    if (error) {
      console.error("Failed to delete room type:", error);

      setError(
        error.message || "Failed to delete room type."
      );

      setDeletingId(null);
      return;
    }

    setRoomTypes((prev) =>
      prev.filter((item) => item.id !== roomType.id)
    );

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
          : item
      )
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
          <div className="text-sm text-gray-500">
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
          <h1 className="text-2xl font-semibold text-gray-900">
            Rooms
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage room types and physical room assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={17} />
          Create Room Type
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">
            {error}
          </p>

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
        <div className="flex min-h-90 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Plus size={22} className="text-gray-500" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              No room types yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Create your first room type, then assign your
              physical rooms to it.
            </p>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
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
          onUpdated={handleRoomTypeUpdated}
        />
      )}
    </div>
  );
}

function RoomTypeCard({
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
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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
            <h2 className="text-lg font-semibold text-gray-900">
              {name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {roomCount}{" "}
              {roomCount === 1 ? "physical room" : "physical rooms"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              {roomType.price_per_night}
            </p>

            <p className="text-xs text-gray-500">
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
                  className="rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700"
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
        <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onView}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Eye size={16} />
            View
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />

            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CardInfo({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2.5">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}