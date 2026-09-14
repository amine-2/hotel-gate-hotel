// src/components/admin/rooms/CreateAmenityModal.jsx

import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { uploadAmenityIcon } from "../../../lib/rooms/uploadAmenityIcon";
import { createAmenity } from "../../../lib/rooms/createAmenity";
import TextField from "./TextField";

export default function CreateAmenityModal({ onClose, onCreated }) {
  const [name, setName] = useState({
    en: "",
    fr: "",
    ar: "",
  });

  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState("");

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  function handleIconChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "image/svg+xml") {
      setError("Only SVG files are allowed.");
      return;
    }

    setError("");
    setIconFile(file);

    const previewUrl = URL.createObjectURL(file);
    setIconPreview(previewUrl);
  }

  function updateName(locale, value) {
    setName((prev) => ({
      ...prev,
      [locale]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.en.trim()) {
      setError("English name is required.");
      return;
    }

    if (!iconFile) {
      setError("Amenity icon is required.");
      return;
    }

    setCreating(true);
    setError("");

    try {
      // 1. Upload icon
      const { data: iconData, error: iconError } =
        await uploadAmenityIcon(iconFile);

      if (iconError) {
        setError(iconError.message || "Failed to upload icon.");
        return;
      }

      // 2. Generate key
      const key =
        name.en
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "") || "amenity";

      // 3. Create database record
      const { data, error: createError } = await createAmenity({
        name: {
          en: name.en.trim(),
          fr: name.fr.trim(),
          ar: name.ar.trim(),
        },
        key,
        icon: iconData.url,
      });

      if (createError) {
        setError(createError.message || "Failed to create amenity.");
        return;
      }

      onCreated?.(data);
      onClose?.();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Create Amenity
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Icon
            </label>

            <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-zinc-300 p-4 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:text-white">
              {iconPreview ? (
                <img
                  src={iconPreview}
                  alt="Amenity icon preview"
                  className="h-12 w-12 object-contain dark:invert"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <ImagePlus size={22} className="text-zinc-500 dark:text-zinc-300" />
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {iconFile ? iconFile.name : "Choose SVG icon"}
                </p>

                <p className="text-xs text-zinc-500">SVG files only</p>
              </div>

              <input
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleIconChange}
                className="hidden"
              />
            </label>
          </div>
          <TextField
            label="English name"
            value={name.en}
            onChange={(value) => updateName("en", value)}
            placeholder="Swimming Pool"
          />

          <TextField
            label="French name"
            value={name.fr}
            onChange={(value) => updateName("fr", value)}
            placeholder="Piscine"
          />

          <TextField
            label="Arabic name"
            value={name.ar}
            onChange={(value) => updateName("ar", value)}
            placeholder="مسبح"
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-orange-400 px-4 py-2 text-sm text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create amenity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
