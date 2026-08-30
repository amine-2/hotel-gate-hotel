import { useState } from "react";
import { X } from "lucide-react";

import { updatePosition } from "../../../lib/candidates/updatePosition";

export default function EditPositionModal({
  position,
  hotelId,
  onClose,
  onSuccess,
}) {
  const [title, setTitle] = useState(position.title || "");

  const [description, setDescription] = useState(
    position.description || ""
  );

  const [status, setStatus] = useState(
    position.status || "open"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Position title is required.");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await updatePosition({
      positionId: position.id,
      hotelId,
      title,
      description,
      status,
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess(result.data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-800 shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 p-5">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Edit Position
          </h2>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-5"
        >
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Position
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none focus:border-zinc-500 dark:border-zinc-600 dark:text-white"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={4}
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none focus:border-zinc-500 dark:border-zinc-600 dark:text-white resize-none"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none focus:border-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-50 cursor-pointer dark:bg-orange-500 dark:hover:bg-orange-600"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}