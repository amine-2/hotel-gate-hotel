import { useRef, useState } from "react";
import {
  ImagePlus,
  GripVertical,
  Trash2,
} from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function RoomTypeImagesManager({
  files = [],
  onChange,
}) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);

  function handleFiles(fileList) {
    const selectedFiles = Array.from(fileList || []);

    if (!selectedFiles.length) return;

    setError("");

    for (const file of selectedFiles) {
      if (!file.type?.startsWith("image/")) {
        setError(`"${file.name}" is not an image.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" is larger than 10 MB.`);
        return;
      }
    }

    onChange([...files, ...selectedFiles]);
  }

  function handleInputChange(event) {
    handleFiles(event.target.files);
    event.target.value = "";
  }

  function handleRemove(index) {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    onChange(updatedFiles);
  }

  function handleDragStart(index) {
    setDraggedIndex(index);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(index) {
    if (
      draggedIndex === null ||
      draggedIndex === index
    ) {
      setDraggedIndex(null);
      return;
    }

    const updatedFiles = [...files];

    const [movedFile] = updatedFiles.splice(
      draggedIndex,
      1
    );

    updatedFiles.splice(index, 0, movedFile);

    onChange(updatedFiles);
    setDraggedIndex(null);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }

  function getPreview(file) {
    return URL.createObjectURL(file);
  }

  return (
    <div className="mt-6">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-900">
          Room Images
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          The first image will be used as the main image.
          Drag images to change their order.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              className={`group relative aspect-4/3 overflow-hidden rounded-xl border bg-gray-100 ${
                draggedIndex === index
                  ? "opacity-50"
                  : ""
              }`}
            >
              <img
                src={getPreview(file)}
                alt={`Room ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {index === 0 && (
                <div className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
                  Main
                </div>
              )}

              <div className="absolute left-2 bottom-2 rounded-md bg-black/60 p-1 text-white">
                <GripVertical size={15} />
              </div>

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-2 top-2 rounded-md bg-white/90 p-1.5 text-gray-700 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-white hover:text-red-600"
                title="Remove image"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={files.length > 0 ? "mt-4" : ""}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-7 text-sm text-gray-500 transition hover:border-gray-400 hover:bg-gray-50"
        >
          <ImagePlus size={20} />

          {files.length
            ? "Add more images"
            : "Upload room images"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />

        <p className="mt-2 text-center text-xs text-gray-400">
          JPG, PNG, WEBP, etc. · Maximum 10 MB per image
        </p>
      </div>
    </div>
  );
}