import { useState } from "react";
import {
  AlertTriangle,
  X,
} from "lucide-react";

import { deleteApplication } from "../../../lib/candidates/deleteApplication";

export default function DeleteApplicationModal({
  application,
  hotelId,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    const result = await deleteApplication({
      applicationId: application.id,
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
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-zinc-800">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-5 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Delete Application
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-4 p-5">

          <div className="flex gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <AlertTriangle
              size={20}
              className="shrink-0 text-red-500"
            />

            <div>
              <p className="font-medium text-red-700 dark:text-red-400">
                Delete "{application.full_name}"?
              </p>

              <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/80">
                This action cannot be undone.
              </p>
            </div>
          </div>

          {application.cv_url && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              The candidate's CV will also be removed.
            </p>
          )}

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
              className="rounded-lg bg-zinc-200 px-4 py-2 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-500 disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? "Deleting..."
                : "Delete Application"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}