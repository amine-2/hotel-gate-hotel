import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";

import { useHotel } from "../../auth/HotelContext";
import { getReceptionRooms } from "../../lib/receptionist/rooms/getReceptionRooms";
import { useNavigate } from "react-router-dom";

import RoomFloorSection from "../../components/reception/rooms/RoomFloorSection";

export default function ReceptionRooms() {
  const { hotelId } = useHotel();
  const navigate = useNavigate();useHotel();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [openFloors, setOpenFloors] = useState({});




  async function loadRooms(showRefresh = false) {
    if (!hotelId) return;

    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    const { data, error } = await getReceptionRooms(hotelId);

    if (error) {
      setError(error.message || "Failed to load rooms");
      setRooms([]);
    } else {
      setRooms(data);
    }

    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    loadRooms();
  }, [hotelId]);

  const getRoomStatus = (room) => {
    return room.status;
  };

  const filteredRooms = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return rooms;
    }

    return rooms.filter((room) => {
      const roomNumber = String(room.room_number || "").toLowerCase();

      const roomType = room?.room_types?.name?.en.toLowerCase() || "";

      const floor = String(room.floor ?? "").toLowerCase();

      return (
        roomNumber.includes(value) ||
        roomType.includes(value) ||
        floor.includes(value)
      );
    });
  }, [rooms, search]);

  const floors = useMemo(() => {
    const grouped = new Map();

    filteredRooms.forEach((room) => {
      const floor = room.floor ?? null;

      if (!grouped.has(floor)) {
        grouped.set(floor, []);
      }

      grouped.get(floor).push(room);
    });

    return Array.from(grouped.entries()).sort(([floorA], [floorB]) => {
      if (floorA === null) return 1;
      if (floorB === null) return -1;

      return Number(floorA) - Number(floorB);
    });
  }, [filteredRooms]);

  useEffect(() => {
    setOpenFloors((current) => {
      const next = { ...current };

      floors.forEach(([floor]) => {
        if (!(floor in next)) {
          next[floor] = true;
        }
      });

      return next;
    });
  }, [floors]);

  const toggleFloor = (floor) => {
    setOpenFloors((current) => ({
      ...current,
      [floor]: !current[floor],
    }));
  };


   function handleRoomClick(room) {
    navigate(`/dashboard/reception/rooms/${room.id}`);
  }

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Loading rooms...
        </div>
      </div>
    );
  }

  return (
    <div className="p-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Rooms
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage hotel rooms.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadRooms(true)}
          disabled={refreshing}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-gray-200
            bg-white
            px-3
            py-2
            text-sm
            font-medium
            text-gray-700
            transition
            hover:bg-gray-50
            disabled:cursor-not-allowed
            disabled:opacity-60
            dark:border-gray-700
            dark:bg-zinc-900
            dark:text-gray-200
            dark:hover:bg-zinc-800
          "
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="
            pointer-events-none
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search room number, type, or floor..."
          className="
            w-full
            rounded-xl
            border
            border-zinc-200
            bg-white
            py-2.5
            pl-10
            pr-4
            text-sm
            text-zinc-900
            outline-none
            transition
            placeholder:text-zinc-400
            focus:border-zinc-400
            dark:border-zinc-700
            dark:bg-zinc-900
            dark:text-white
            dark:placeholder:text-zinc-500
            dark:focus:border-zinc-500
          "
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
        <StatusLegend color="bg-green-500" label="Occupied" />
        <StatusLegend color="bg-blue-500" label="Available" />
        <StatusLegend color="bg-orange-500" label="Reserved" />
        <StatusLegend color="bg-red-500" label="Inactive" />
      </div>

      {/* Floors */}
      {floors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            No rooms found
          </p>

          {search && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Try a different search.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {floors.map(([floor, floorRooms]) => (
            <RoomFloorSection
              key={floor ?? "unassigned"}
              floor={floor}
              rooms={floorRooms}
              isOpen={Boolean(openFloors[floor])}
              onToggle={() => toggleFloor(floor)}
              getRoomStatus={getRoomStatus}
              onRoomClick={handleRoomClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatusLegend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
