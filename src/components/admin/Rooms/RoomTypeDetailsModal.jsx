import { X } from "lucide-react";

export default function RoomTypeDetailsModal({
  roomType,
  onClose,
}) {
  if (!roomType) return null;

  const name =
    roomType.name?.en ||
    roomType.name?.fr ||
    roomType.name?.ar ||
    "Unnamed Room Type";

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
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onClose}
    >
      <div
        className="relative z-101 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Room type details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-7 p-6">
          {/* Images */}
          {roomType.images?.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Images
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {roomType.images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="aspect-4/3 overflow-hidden rounded-xl bg-gray-100"
                  >
                    <img
                      src={image}
                      alt={`${name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic information */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Information
            </h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <InfoItem
                label="Price"
                value={`${roomType.price_per_night} / night`}
              />

              <InfoItem
                label="Capacity"
                value={`${roomType.capacity} ${
                  roomType.capacity === 1
                    ? "person"
                    : "people"
                }`}
              />

              <InfoItem
                label="Size"
                value={`${roomType.size} m²`}
              />

              <InfoItem
                label="Status"
                value={roomType.status || "draft"}
              />
            </div>
          </div>

          {/* Description */}
          {roomType.description && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                Description
              </h3>

              <p className="text-sm leading-6 text-gray-600">
                {roomType.description.en ||
                  roomType.description.fr ||
                  roomType.description.ar ||
                  "No description"}
              </p>
            </div>
          )}

          {/* Beds */}
          {roomType.beds?.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Beds
              </h3>

              <div className="flex flex-wrap gap-2">
                {roomType.beds.map((bed, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700"
                  >
                    {bed.quantity} × {bed.type}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {roomType.amenities?.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Amenities
              </h3>

              <div className="flex flex-wrap gap-2">
                {roomType.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Physical rooms */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Assigned Rooms
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Physical rooms currently using this room type.
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {rooms.length}{" "}
                {rooms.length === 1 ? "room" : "rooms"}
              </span>
            </div>

            {rooms.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
                <p className="text-sm text-gray-500">
                  No physical rooms are assigned to this
                  room type.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2"
                  >
                    <span className="font-medium text-gray-900">
                      {room.room_number}
                    </span>

                    {room.floor !== null &&
                      room.floor !== undefined && (
                        <span className="ml-2 text-xs text-gray-500">
                          Floor {room.floor}
                        </span>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium capitalize text-gray-900">
        {value}
      </p>
    </div>
  );
}