import { useState } from "react";
import { addHotelImage } from "../../../lib/hotel/addHotelImage";
import { removeHotelImage } from "../../../lib/hotel/removeHotelImage";
import { reorderHotelImages } from "../../../lib/hotel/reorderHotelImages";

export default function HotelImagesManager({
  hotel,
  hotelId,
  onHotelUpdated,
}) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [reordering, setReordering] = useState(false);

  const images = hotel?.images || [];

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const { data, error } = await addHotelImage(hotelId, file);

    setUploading(false);

    event.target.value = "";

    if (error) {
      alert(error.message);
      return;
    }

    onHotelUpdated(data);
  };

  const handleDelete = async (imageUrl) => {
    if (!confirm("Are you sure you want to remove this image?")) {
      return;
    }

    setDeleting(imageUrl);

    const { data, error } = await removeHotelImage(
      hotelId,
      imageUrl
    );

    setDeleting(null);

    if (error) {
      alert(error.message);
      return;
    }

    onHotelUpdated(data);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (dropIndex) => {
    if (
      draggedIndex === null ||
      draggedIndex === dropIndex
    ) {
      setDraggedIndex(null);
      return;
    }

    const reorderedImages = [...images];

    const [draggedImage] = reorderedImages.splice(
      draggedIndex,
      1
    );

    reorderedImages.splice(
      dropIndex,
      0,
      draggedImage
    );

    // Update UI immediately
    onHotelUpdated({
      ...hotel,
      images: reorderedImages,
    });

    setDraggedIndex(null);
    setReordering(true);

    const { data, error } = await reorderHotelImages(
      hotelId,
      reorderedImages
    );

    setReordering(false);

    if (error) {
      alert(error.message);

      // Restore original order if save failed
      onHotelUpdated(hotel);

      return;
    }

    onHotelUpdated(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Hotel Images
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag images to reorder them. The first image
            is the main image.
          </p>
        </div>

        <label className="cursor-pointer rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-orange-500 dark:hover:bg-orange-600">
          {uploading ? "Uploading..." : "Upload Image"}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <p className="text-xs text-gray-500">
        Maximum file size: 10 MB
      </p>

      {/* Images */}
      {images.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          No images uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image}
              draggable={!reordering}
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => setDraggedIndex(null)}
              className={`
                group relative overflow-hidden rounded-xl
                border bg-white dark:bg-gray-800 dark:border-gray-700
                transition
                ${
                  draggedIndex === index
                    ? "scale-95 opacity-50"
                    : "opacity-100"
                }
                ${
                  reordering
                    ? "cursor-wait"
                    : "cursor-grab active:cursor-grabbing"
                }
              `}
            >
              <img
                src={image}
                alt={`Hotel image ${index + 1}`}
                className="h-48 w-full object-cover"
              />

              {/* Main badge */}
              {index === 0 && (
                <div className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
                  Main Image
                </div>
              )}

              {/* Drag hint */}
              <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 ">
                Drag to reorder
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleDelete(image);
                }}
                disabled={
                  deleting === image || reordering
                }
                className="absolute right-2 top-2 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting === image
                  ? "Removing..."
                  : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}

      {reordering && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Saving new image order...
        </p>
      )}
    </div>
  );
}