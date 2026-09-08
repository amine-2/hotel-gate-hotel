import { useState } from "react";
import { createRoomType } from "../../../lib/rooms/createRoomType";
import RoomTypeImagesManager from "./RoomTypeImagesManager";
import { uploadRoomTypeImage } from "../../../lib/rooms/uploadRoomTypeImage";
import { updateRoomTypeImages } from "../../../lib/rooms/updateRoomTypeImages";

export default function AddRoomTypeModal({ hotelId, onClose, onCreated }) {
  const [nameEn, setNameEn] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [nameAr, setNameAr] = useState("");

  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");

  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [size, setSize] = useState("");

  const [freeCancellation, setFreeCancellation] = useState(false);

  const [discount, setDiscount] = useState("");

  const [beds, setBeds] = useState([
    {
      type: "double",
      quantity: 1,
    },
  ]);

  const [amenities, setAmenities] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);

  function updateBed(index, field, value) {
    setBeds((prev) =>
      prev.map((bed, i) =>
        i === index
          ? {
              ...bed,
              [field]: field === "quantity" ? Number(value) : value,
            }
          : bed,
      ),
    );
  }

  function addBed() {
    setBeds((prev) => [
      ...prev,
      {
        type: "single",
        quantity: 1,
      },
    ]);
  }

  function removeBed(index) {
    setBeds((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleAmenity(amenity) {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity],
    );
  }

  async function handleSubmit() {
  setError(null);

  if (!nameEn.trim()) {
    setError("English room type name is required.");
    return;
  }

  if (!nameFr.trim()) {
    setError("French room type name is required.");
    return;
  }

  if (!nameAr.trim()) {
    setError("Arabic room type name is required.");
    return;
  }

  if (price === "" || Number(price) < 0) {
    setError("Enter a valid price.");
    return;
  }

  if (
    capacity === "" ||
    !Number.isInteger(Number(capacity)) ||
    Number(capacity) <= 0
  ) {
    setError("Capacity must be a whole number greater than 0.");
    return;
  }

  if (size === "" || Number(size) < 0) {
    setError("Enter a valid room size.");
    return;
  }

  if (
    discount !== "" &&
    (Number(discount) < 0 || Number(discount) > 100)
  ) {
    setError("Discount must be between 0 and 100.");
    return;
  }

  setSaving(true);

  const payload = {
    name: {
      en: nameEn.trim(),
      fr: nameFr.trim(),
      ar: nameAr.trim(),
    },

    description: {
      en: descriptionEn.trim(),
      fr: descriptionFr.trim(),
      ar: descriptionAr.trim(),
    },

    price_per_night: price,
    capacity,
    size,

    beds: beds.filter(
      (bed) => bed.type.trim() && Number(bed.quantity) > 0
    ),

    amenities,

    free_cancellation: freeCancellation,

    discount,
  };

  // 1. Create the room type first
  const {
    data: createdRoomType,
    error: createError,
  } = await createRoomType(hotelId, payload);

  if (createError) {
    console.error(
      "Failed to create room type:",
      createError
    );

    setError(
      createError.message || "Failed to create room type."
    );

    setSaving(false);
    return;
  }

  // No images selected
  if (!images.length) {
    onCreated?.({
      ...createdRoomType,
      images: [],
      rooms: [],
    });

    setSaving(false);
    return;
  }

  // 2. Upload images in their current order
  const uploadedPaths = [];
  const imageUrls = [];

  for (const file of images) {
    const {
      data: uploadedImage,
      error: uploadError,
    } = await uploadRoomTypeImage(
      hotelId,
      createdRoomType.id,
      file
    );

    if (uploadError) {
      console.error(
        "Failed to upload room type image:",
        uploadError
      );

      // Clean up files that were already uploaded
      for (const path of uploadedPaths) {
        const { error: deleteError } =
          await supabase.storage
            .from("room-types-imgs")
            .remove([path]);

        if (deleteError) {
          console.error(
            "Failed to clean up uploaded image:",
            deleteError
          );
        }
      }

      setError(
        uploadError.message ||
          "Failed to upload room type images."
      );

      setSaving(false);
      return;
    }

    uploadedPaths.push(uploadedImage.path);
    imageUrls.push(uploadedImage.url);
  }

  // 3. Save the image URLs in room_types.images
  const {
    data: updatedRoomType,
    error: imageUpdateError,
  } = await updateRoomTypeImages(
    hotelId,
    createdRoomType.id,
    imageUrls
  );

  if (imageUpdateError) {
    console.error(
      "Failed to save room type images:",
      imageUpdateError
    );

    // Clean up uploaded files
    for (const path of uploadedPaths) {
      const { error: deleteError } =
        await supabase.storage
          .from("room-types-imgs")
          .remove([path]);

      if (deleteError) {
        console.error(
          "Failed to clean up uploaded image:",
          deleteError
        );
      }
    }

    setError(
      imageUpdateError.message ||
        "Images uploaded but could not be saved."
    );

    setSaving(false);
    return;
  }

  // 4. Return the completed room type to RoomsPage
  onCreated?.({
    ...updatedRoomType,
    rooms: [],
  });

  setSaving(false);
}

  const availableAmenities = [
    "Wi-Fi",
    "Air Conditioning",
    "TV",
    "Mini Bar",
    "Safe",
    "Hair Dryer",
    "Desk",
    "Balcony",
  ];

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative z-101 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Create Room Type</h2>

          <p className="mt-1 text-sm text-gray-500">
            Create a room type that can later be assigned to physical rooms.
          </p>
        </div>

        <div className="space-y-6">
          <RoomTypeImagesManager files={images} onChange={setImages} />
          {/* Names */}
          <section>
            <h3 className="mb-3 text-sm font-medium">Room Name</h3>

            <div className="space-y-3">
              <Input
                label="English"
                value={nameEn}
                onChange={setNameEn}
                placeholder="Deluxe Room"
                disabled={saving}
              />

              <Input
                label="French"
                value={nameFr}
                onChange={setNameFr}
                placeholder="Chambre Deluxe"
                disabled={saving}
              />

              <Input
                label="Arabic"
                value={nameAr}
                onChange={setNameAr}
                placeholder="غرفة ديلوكس"
                disabled={saving}
                dir="rtl"
              />
            </div>
          </section>

          {/* Descriptions */}
          <section>
            <h3 className="mb-3 text-sm font-medium">Description</h3>

            <div className="space-y-3">
              <Textarea
                label="English"
                value={descriptionEn}
                onChange={setDescriptionEn}
                placeholder="Describe this room type..."
                disabled={saving}
              />

              <Textarea
                label="French"
                value={descriptionFr}
                onChange={setDescriptionFr}
                placeholder="Décrivez ce type de chambre..."
                disabled={saving}
              />

              <Textarea
                label="Arabic"
                value={descriptionAr}
                onChange={setDescriptionAr}
                placeholder="وصف نوع الغرفة..."
                disabled={saving}
                dir="rtl"
              />
            </div>
          </section>

          {/* Basic information */}
          <section>
            <h3 className="mb-3 text-sm font-medium">Room Information</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <NumberInput
                label="Price / Night"
                value={price}
                onChange={setPrice}
                placeholder="150"
                disabled={saving}
                min="0"
                step="0.01"
              />

              <NumberInput
                label="Capacity"
                value={capacity}
                onChange={setCapacity}
                placeholder="2"
                disabled={saving}
                min="1"
                step="1"
              />

              <NumberInput
                label="Size (m²)"
                value={size}
                onChange={setSize}
                placeholder="25"
                disabled={saving}
                min="0"
                step="0.1"
              />
            </div>
          </section>

          {/* Beds */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">Beds</h3>

              <button
                type="button"
                onClick={addBed}
                disabled={saving}
                className="text-sm font-medium hover:underline"
              >
                + Add Bed
              </button>
            </div>

            <div className="space-y-2">
              {beds.map((bed, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={bed.type}
                    onChange={(e) => updateBed(index, "type", e.target.value)}
                    disabled={saving}
                    className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-black focus:ring-2"
                  >
                    <option value="single">Single Bed</option>

                    <option value="double">Double Bed</option>

                    <option value="queen">Queen Bed</option>

                    <option value="king">King Bed</option>

                    <option value="twin">Twin Bed</option>

                    <option value="sofa_bed">Sofa Bed</option>
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={bed.quantity}
                    onChange={(e) =>
                      updateBed(index, "quantity", e.target.value)
                    }
                    disabled={saving}
                    className="w-20 rounded-lg border px-3 py-2 text-sm outline-none focus:border-black focus:ring-2"
                  />

                  {beds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBed(index)}
                      disabled={saving}
                      className="rounded-lg border px-3 text-lg text-gray-400 hover:border-red-200 hover:text-red-500"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h3 className="mb-3 text-sm font-medium">Amenities</h3>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {availableAmenities.map((amenity) => {
                const selected = amenities.includes(amenity);

                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    disabled={saving}
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      selected
                        ? "border-black bg-black text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Cancellation / Discount */}
          <section>
            <h3 className="mb-3 text-sm font-medium">Pricing Options</h3>

            <div className="space-y-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={freeCancellation}
                  onChange={(e) => setFreeCancellation(e.target.checked)}
                  disabled={saving}
                  className="h-4 w-4"
                />

                <span className="text-sm">Free cancellation</span>
              </label>

              <div className="max-w-xs">
                <NumberInput
                  label="Discount (%)"
                  value={discount}
                  onChange={setDiscount}
                  placeholder="10"
                  disabled={saving}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Room Type"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, disabled, dir }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-gray-500">{label}</label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        dir={dir}
        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black focus:ring-2"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, disabled, dir }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-gray-500">{label}</label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        dir={dir}
        rows={3}
        className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:border-black focus:ring-2"
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  min,
  max,
  step,
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-gray-500">{label}</label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-black focus:ring-2"
      />
    </div>
  );
}
