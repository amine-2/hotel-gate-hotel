import { useState } from "react";
import { Plus } from "lucide-react";

import { useHotel } from "../../../auth/HotelContext";
import usePositions from "../../../hooks/usePositions";

import PositionCard from "./PositionCard";
import AddPositionModal from "./AddPositionModal";
import EditPositionModal from "./EditPositionModal";
import DeletePositionModal from "./DeletePositionModal";

export default function PositionsSection({ onSelectPosition }) {
  const { hotelId } = useHotel();

  const {
    positions,
    loading,
    error,
    reload,
  } = usePositions(hotelId);

  const [openAdd, setOpenAdd] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [deletingPosition, setDeletingPosition] = useState(null);

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Candidates
          </h1>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage open positions and job applications
          </p>
        </div>

        <button
          onClick={() => setOpenAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 transition cursor-pointer dark:bg-orange-500 dark:hover:bg-orange-600"
        >
          <Plus size={17} />
          Add Position
        </button>
      </div>

      {/* POSITIONS */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 rounded-xl bg-zinc-100 animate-pulse dark:bg-zinc-800"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 p-6 text-red-500">
          Failed to load positions.
        </div>
      ) : positions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-10 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            No positions available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {positions.map((position) => (
            <PositionCard
              key={position.id}
              position={position}
              onClick={() => onSelectPosition(position)}
              onEdit={() => setEditingPosition(position)}
              onDelete={() => setDeletingPosition(position)}
            />
          ))}
        </div>
      )}

      {/* ADD */}
      {openAdd && (
        <AddPositionModal
          hotelId={hotelId}
          onClose={() => setOpenAdd(false)}
          onSuccess={() => {
            setOpenAdd(false);
            reload();
          }}
        />
      )}

      {/* EDIT */}
      {editingPosition && (
        <EditPositionModal
          position={editingPosition}
          hotelId={hotelId}
          onClose={() => setEditingPosition(null)}
          onSuccess={() => {
            setEditingPosition(null);
            reload();
          }}
        />
      )}

      {/* DELETE */}
      {deletingPosition && (
        <DeletePositionModal
          position={deletingPosition}
          hotelId={hotelId}
          onClose={() => setDeletingPosition(null)}
          onSuccess={() => {
            setDeletingPosition(null);
            reload();
          }}
        />
      )}
    </>
  );
}