import { useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  PenLine,
  Trash2,
} from "lucide-react";

import { updateApplication } from "../../../lib/candidates/updateApplication";
import DeleteApplicationModal from "./DeleteApplicationModal";

const statuses = [
  "new",
  "reviewing",
  "interview",
  "accepted",
  "rejected",
];

export default function ApplicationDetails({
  application,
  hotelId,
  onBack,
  onUpdated,
  onDeleted,
}) {
  const [editing, setEditing] =
    useState(false);

  const [form, setForm] = useState({
    full_name: application.full_name || "",
    email: application.email || "",
    phone: application.phone || "",
    address: application.address || "",
    notes: application.notes || "",
    status: application.status || "new",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [showDelete, setShowDelete] =
    useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) {
      setError("Candidate name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await updateApplication({
      applicationId: application.id,
      hotelId,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      cv_url: application.cv_url,
      status: form.status,
      notes: form.notes,
    });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setEditing(false);

    onUpdated(result.data);
  };

  const handleCancel = () => {
    setForm({
      full_name: application.full_name || "",
      email: application.email || "",
      phone: application.phone || "",
      address: application.address || "",
      notes: application.notes || "",
      status: application.status || "new",
    });

    setError(null);
    setEditing(false);
  };

  return (
    <>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
          >
            <ArrowLeft size={17} />
            Back to Applications
          </button>

          <div className="flex gap-2">

            {!editing && (
              <>
                <button
                  onClick={() =>
                    setEditing(true)
                  }
                  className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 cursor-pointer"
                >
                  <PenLine size={16} />
                  Edit
                </button>

                <button
                  onClick={() =>
                    setShowDelete(true)
                  }
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500 cursor-pointer"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </>
            )}

          </div>
        </div>

        {/* CANDIDATE */}
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">

          {editing ? (
            <div>
              <label className="text-sm text-zinc-500 dark:text-zinc-400">
                Full Name
              </label>

              <input
                value={form.full_name}
                onChange={(e) =>
                  handleChange(
                    "full_name",
                    e.target.value
                  )
                }
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-xl font-semibold outline-none dark:border-zinc-600 dark:text-white"
              />
            </div>
          ) : (
            <h2 className="text-xl font-semibold dark:text-white">
              {application.full_name}
            </h2>
          )}

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* EMAIL */}
            <div>
              <p className="text-xs text-zinc-400">
                Email
              </p>

              {editing ? (
                <input
                  value={form.email}
                  onChange={(e) =>
                    handleChange(
                      "email",
                      e.target.value
                    )
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-600 dark:text-white"
                />
              ) : (
                <p className="mt-1 dark:text-zinc-200">
                  {application.email || "—"}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <p className="text-xs text-zinc-400">
                Phone
              </p>

              {editing ? (
                <input
                  value={form.phone}
                  onChange={(e) =>
                    handleChange(
                      "phone",
                      e.target.value
                    )
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-600 dark:text-white"
                />
              ) : (
                <p className="mt-1 dark:text-zinc-200">
                  {application.phone || "—"}
                </p>
              )}
            </div>

            {/* ADDRESS */}
            <div>
              <p className="text-xs text-zinc-400">
                Address
              </p>

              {editing ? (
                <input
                  value={form.address}
                  onChange={(e) =>
                    handleChange(
                      "address",
                      e.target.value
                    )
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-600 dark:text-white"
                />
              ) : (
                <p className="mt-1 dark:text-zinc-200">
                  {application.address || "—"}
                </p>
              )}
            </div>

            {/* APPLIED */}
            <div>
              <p className="text-xs text-zinc-400">
                Applied
              </p>

              <p className="mt-1 dark:text-zinc-200">
                {application.created_at
                  ? new Date(
                      application.created_at
                    ).toLocaleDateString()
                  : "—"}
              </p>
            </div>

          </div>
        </div>

        {/* CV */}
        <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">

          <h3 className="font-semibold dark:text-white">
            CV
          </h3>

          {application.cv_url ? (
            <a
              href={application.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-orange-500 dark:hover:bg-orange-600"
            >
              Open CV
              <ExternalLink size={16} />
            </a>
          ) : (
            <p className="mt-3 text-sm text-zinc-500">
              No CV uploaded.
            </p>
          )}

        </div>

        {/* STATUS + NOTES */}
        <div className="rounded-xl border border-zinc-200 p-6 space-y-5 dark:border-zinc-700">

          {/* STATUS */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-zinc-300">
              Status
            </label>

            {editing ? (
              <select
                value={form.status}
                onChange={(e) =>
                  handleChange(
                    "status",
                    e.target.value
                  )
                }
                className="w-full md:w-64 rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
              >
                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status
                      .charAt(0)
                      .toUpperCase() +
                      status.slice(1)}
                  </option>
                ))}
              </select>
            ) : (
              <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm capitalize dark:bg-zinc-700 dark:text-zinc-300">
                {application.status}
              </span>
            )}
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-zinc-300">
              Notes
            </label>

            {editing ? (
              <textarea
                value={form.notes}
                onChange={(e) =>
                  handleChange(
                    "notes",
                    e.target.value
                  )
                }
                rows={5}
                className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 resize-none dark:border-zinc-600 dark:text-white"
              />
            ) : (
              <p className="whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
                {application.notes ||
                  "No notes."}
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          {/* EDIT ACTIONS */}
          {editing && (
            <div className="flex justify-end gap-3">

              <button
                onClick={handleCancel}
                disabled={loading}
                className="rounded-lg bg-zinc-200 px-4 py-2 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-500 disabled:opacity-50 cursor-pointer"
              >
                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>
          )}

        </div>
      </div>

      {/* DELETE MODAL */}
      {showDelete && (
        <DeleteApplicationModal
          application={application}
          hotelId={hotelId}
          onClose={() =>
            setShowDelete(false)
          }
          onSuccess={() => {
            setShowDelete(false);
            onDeleted();
          }}
        />
      )}
    </>
  );
}