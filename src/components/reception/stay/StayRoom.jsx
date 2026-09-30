export default function StayRoom({ stay }) {
  const room = stay.rooms;
  const roomType = room?.room_types;

  return (
    <section className="rounded-xl border border-gray-200 shadow dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
      <h2 className="text-lg font-semibold mb-4">
        Final Room
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div>
          <p className="text-xs text-gray-500">Room</p>
          <p className="mt-1 text-sm font-medium">
            {room?.room_number || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Floor</p>
          <p className="mt-1 text-sm font-medium">
            {room?.floor ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Room Type</p>
          <p className="mt-1 text-sm font-medium">
            {roomType?.name?.en ||
              roomType?.name?.fr ||
              roomType?.name?.ar ||
              "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Capacity</p>
          <p className="mt-1 text-sm font-medium">
            {roomType?.capacity ?? "-"}
          </p>
        </div>
      </div>
    </section>
  );
}