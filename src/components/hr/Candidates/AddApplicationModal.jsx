import { useState } from "react";
import { X } from "lucide-react";

import { addApplication } from "../../../lib/candidates/addApplication";
import { uploadCandidateCV } from "../../../lib/candidates/uploadCandidateCV";

export default function AddApplicationModal({
  hotelId,
  position,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [cv, setCv] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name.trim()) {
      setError("Candidate name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      /*
       * Create application first.
       * We need its ID for the CV path.
       */
      const application = await addApplication({
        hotelId,
        positionId: position.id,
        ...form,
      });

      if (application.error) {
        throw application.error;
      }

      let cvUrl = null;

      if (cv) {
        cvUrl = await uploadCandidateCV(
          application.data.id,
          cv
        );

        /*
         * Update the application with the CV URL.
         */
        const { updateApplication } =
          await import(
            "../../../lib/candidates/updateApplication"
          );

        const updated = await updateApplication({
          applicationId: application.data.id,
          hotelId,
          ...form,
          cv_url: cvUrl,
        });

        if (updated.error) {
          throw updated.error;
        }
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to create application."
      );
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-zinc-800 shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 p-5">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Add Application
            </h2>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {position.title}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4"
        >
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-zinc-300">
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
              placeholder="Candidate name"
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none dark:border-zinc-600 dark:text-white"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-zinc-300">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                handleChange(
                  "email",
                  e.target.value
                )
              }
              placeholder="candidate@email.com"
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none dark:border-zinc-600 dark:text-white"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-zinc-300">
              Phone
            </label>

            <input
              value={form.phone}
              onChange={(e) =>
                handleChange(
                  "phone",
                  e.target.value
                )
              }
              placeholder="Phone number"
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none dark:border-zinc-600 dark:text-white"
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-zinc-300">
              Address
            </label>

            <input
              value={form.address}
              onChange={(e) =>
                handleChange(
                  "address",
                  e.target.value
                )
              }
              placeholder="Address"
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none dark:border-zinc-600 dark:text-white"
            />
          </div>

          {/* CV */}
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-zinc-300">
              CV
            </label>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setCv(e.target.files?.[0] || null)
              }
              className="w-full text-sm dark:text-zinc-300"
            />
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-sm font-medium mb-1.5 dark:text-zinc-300">
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(e) =>
                handleChange(
                  "notes",
                  e.target.value
                )
              }
              rows={3}
              placeholder="Additional notes..."
              className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none resize-none dark:border-zinc-600 dark:text-white"
            />
          </div>

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
              className="px-4 py-2 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-orange-500 dark:hover:bg-orange-600 cursor-pointer"
            >
              {loading
                ? "Adding..."
                : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}