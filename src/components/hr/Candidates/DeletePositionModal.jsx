import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

import { deletePosition } from "../../../lib/candidates/deletePosition";

export default function DeletePositionModal({
  position,
  hotelId,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    const result = await deletePosition({
      positionId: position.id,
      hotelId,
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-800 shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 p-5">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Delete Position
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-4">

          <div className="flex gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
            <AlertTriangle
              size={20}
              className="text-red-500 shrink-0"
            />

            <div>
              <p className="font-medium text-red-700 dark:text-red-400">
                Delete "{position.title}"?
              </p>

              <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Deleting this position will also delete all
            applications associated with it.
          </p>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-zinc-200 hover:bg-zinc-300 disabled:opacity-50 dark:bg-zinc-700 dark:hover:bg-zinc-600 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Deleting..." : "Delete Position"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}