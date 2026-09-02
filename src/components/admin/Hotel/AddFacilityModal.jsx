import { useState } from "react";
import { createFacility } from "../../../lib/hotel/createFacility";

export default function AddFacilityModal({
  onClose,
  onCreated,
}) {
  const [name, setName] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    setSaving(true);
    setError(null);

    const { data, error } = await createFacility(
      name,
      iconFile
    );

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    onCreated(data);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 dark:bg-black/50 ">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-800">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            Create Facility
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add a new facility that can be assigned to hotels.
          </p>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Facility Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Swimming Pool"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
              disabled={saving}
            />
          </div>

          {/* Icon */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Facility Icon
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setIconFile(e.target.files?.[0] || null);
              }}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              disabled={saving}
            />

            {iconFile && (
              <p className="mt-2 text-xs text-gray-500">
                {iconFile.name}
              </p>
            )}

            <p className="mt-1 text-xs text-gray-400">
              Image only, maximum 5 MB.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                saving ||
                !name.trim() ||
                !iconFile
              }
              className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Facility"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}