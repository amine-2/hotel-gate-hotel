import { useEffect, useRef, useState } from "react";
import {
  X,
  Plus,
  Trash2,
  GripVertical,
  ImagePlus,
} from "lucide-react";

import { updateRoomType } from "../../../lib/rooms/updateRoomType";
import { uploadRoomTypeImage } from "../../../lib/rooms/uploadRoomTypeImage";
import { updateRoomTypeImages } from "../../../lib/rooms/updateRoomTypeImages";
import { deleteRoomTypeImage } from "../../../lib/rooms/deleteRoomTypeImage";
import { getRoomTypeImagePath } from "../../../lib/rooms/getRoomTypeImagePath";
import { removeRoomFromRoomType } from "../../../lib/rooms/removeRoomFromRoomType";
import AddRoomsToRoomTypeModal from "./AddRoomsToRoomTypeModal";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function EditRoomTypeModal({
  hotelId,
  roomType,
  onClose,
  onUpdated,
}) {
  const inputRef = useRef(null);

  const [name, setName] = useState({
    en: "",
    fr: "",
    ar: "",
  });

  const [description, setDescription] = useState({
    en: "",
    fr: "",
    ar: "",
  });

  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [size, setSize] = useState("");

  const [beds, setBeds] = useState([
    {
      type: "double",
      quantity: 1,
    },
  ]);

  const [amenities, setAmenities] = useState([]);
  const [freeCancellation, setFreeCancellation] =
    useState(false);
  const [discount, setDiscount] = useState("");

  // Images:
  // {
  //   type: "existing",
  //   url: "..."
  // }
  //
  // or
  //
  // {
  //   type: "new",
  //   file: File,
  //   preview: "blob:..."
  // }
  const [images, setImages] = useState([]);

  // Physical rooms assigned to this room type
  const [assignedRooms, setAssignedRooms] = useState([]);

  const [showAddRooms, setShowAddRooms] =
    useState(false);

  const [removingRoomId, setRemovingRoomId] =
    useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [draggedIndex, setDraggedIndex] =
    useState(null);

  useEffect(() => {
    if (!roomType) return;

    setName({
      en: roomType.name?.en || "",
      fr: roomType.name?.fr || "",
      ar: roomType.name?.ar || "",
    });

    setDescription({
      en: roomType.description?.en || "",
      fr: roomType.description?.fr || "",
      ar: roomType.description?.ar || "",
    });

    setPrice(roomType.price_per_night ?? "");
    setCapacity(roomType.capacity ?? "");
    setSize(roomType.size ?? "");

    setBeds(
      Array.isArray(roomType.beds) &&
        roomType.beds.length > 0
        ? roomType.beds.map((bed) => ({
            type: bed.type || "double",
            quantity: bed.quantity || 1,
          }))
        : [
            {
              type: "double",
              quantity: 1,
            },
          ]
    );

    setAmenities(
      Array.isArray(roomType.amenities)
        ? roomType.amenities
        : []
    );

    setFreeCancellation(
      Boolean(roomType.free_cancellation)
    );

    setDiscount(
      roomType.discount === null ||
        roomType.discount === undefined
        ? ""
        : roomType.discount
    );

    setImages(
      Array.isArray(roomType.images)
        ? roomType.images.map((url) => ({
            type: "existing",
            url,
          }))
        : []
    );

    setAssignedRooms(
      Array.isArray(roomType.rooms)
        ? [...roomType.rooms]
        : []
    );
  }, [roomType]);

  // --------------------------------------------------
  // Name
  // --------------------------------------------------

  function handleNameChange(language, value) {
    setName((prev) => ({
      ...prev,
      [language]: value,
    }));
  }

  // --------------------------------------------------
  // Description
  // --------------------------------------------------

  function handleDescriptionChange(
    language,
    value
  ) {
    setDescription((prev) => ({
      ...prev,
      [language]: value,
    }));
  }

  // --------------------------------------------------
  // Beds
  // --------------------------------------------------

  function handleBedChange(
    index,
    field,
    value
  ) {
    setBeds((prev) =>
      prev.map((bed, bedIndex) =>
        bedIndex === index
          ? {
              ...bed,
              [field]: value,
            }
          : bed
      )
    );
  }

  function addBed() {
    setBeds((prev) => [
      ...prev,
      {
        type: "double",
        quantity: 1,
      },
    ]);
  }

  function removeBed(index) {
    setBeds((prev) => {
      if (prev.length === 1) return prev;

      return prev.filter(
        (_, bedIndex) => bedIndex !== index
      );
    });
  }

  // --------------------------------------------------
  // Amenities
  // --------------------------------------------------

  function toggleAmenity(amenity) {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter(
            (item) => item !== amenity
          )
        : [...prev, amenity]
    );
  }

  // --------------------------------------------------
  // Images
  // --------------------------------------------------

  function handleFiles(fileList) {
    const selectedFiles = Array.from(
      fileList || []
    );

    if (!selectedFiles.length) return;

    setError("");

    for (const file of selectedFiles) {
      if (!file.type?.startsWith("image/")) {
        setError(
          `"${file.name}" is not an image.`
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(
          `"${file.name}" is larger than 10 MB.`
        );
        return;
      }
    }

    const newImages = selectedFiles.map(
      (file) => ({
        type: "new",
        file,
        preview: URL.createObjectURL(file),
      })
    );

    setImages((prev) => [
      ...prev,
      ...newImages,
    ]);
  }

  function handleInputChange(event) {
    handleFiles(event.target.files);

    event.target.value = "";
  }

  function removeImage(index) {
    setImages((prev) =>
      prev.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );
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

    setImages((prev) => {
      const updated = [...prev];

      const [moved] = updated.splice(
        draggedIndex,
        1
      );

      updated.splice(index, 0, moved);

      return updated;
    });

    setDraggedIndex(null);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }

  // --------------------------------------------------
  // Rooms
  // --------------------------------------------------

  function handleRoomsAdded(newRooms) {
    setAssignedRooms((prev) => {
      const existingIds = new Set(
        prev.map((room) => room.id)
      );

      return [
        ...prev,
        ...newRooms.filter(
          (room) =>
            !existingIds.has(room.id)
        ),
      ];
    });

    setShowAddRooms(false);
  }

  async function handleRemoveRoom(room) {
    const confirmed = window.confirm(
      `Remove room ${room.room_number} from this room type?\n\nThe physical room will not be deleted. It will simply become unassigned.`
    );

    if (!confirmed) return;

    setError("");
    setRemovingRoomId(room.id);

    const { error } =
      await removeRoomFromRoomType(
        hotelId,
        roomType.id,
        room.id
      );

    if (error) {
      console.error(
        "Failed to remove room:",
        error
      );

      setError(
        error.message ||
          "Failed to remove room."
      );

      setRemovingRoomId(null);
      return;
    }

    setAssignedRooms((prev) =>
      prev.filter(
        (item) => item.id !== room.id
      )
    );

    setRemovingRoomId(null);
  }

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  async function handleSubmit() {
    setError("");

    if (!name.en.trim()) {
      setError(
        "English room type name is required."
      );
      return;
    }

    if (price === "" || Number(price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (
      capacity === "" ||
      !Number.isInteger(Number(capacity)) ||
      Number(capacity) <= 0
    ) {
      setError(
        "Capacity must be a whole number greater than 0."
      );
      return;
    }

    if (
      size === "" ||
      Number(size) < 0
    ) {
      setError(
        "Please enter a valid room size."
      );
      return;
    }

    const cleanedBeds = beds.filter(
      (bed) =>
        bed.type?.trim() &&
        Number(bed.quantity) > 0
    );

    if (cleanedBeds.length === 0) {
      setError("Please add at least one bed.");
      return;
    }

    if (
      discount !== "" &&
      (Number(discount) < 0 ||
        Number(discount) > 100)
    ) {
      setError(
        "Discount must be between 0 and 100."
      );
      return;
    }

    setSaving(true);

    const newlyUploadedPaths = [];

    try {
      // ------------------------------------------
      // 1. Update room type information
      // ------------------------------------------

      const {
        data: updatedRoomType,
        error: updateError,
      } = await updateRoomType(
        hotelId,
        roomType.id,
        {
          name: {
            en: name.en.trim(),
            fr: name.fr.trim(),
            ar: name.ar.trim(),
          },

          description: {
            en: description.en.trim(),
            fr: description.fr.trim(),
            ar: description.ar.trim(),
          },

          price_per_night: price,
          capacity,
          size,
          beds: cleanedBeds,
          amenities,
          free_cancellation:
            freeCancellation,
          discount,
        }
      );

      if (updateError) {
        throw updateError;
      }

      // ------------------------------------------
      // 2. Find existing images that were removed
      // ------------------------------------------

      const originalImages =
        Array.isArray(roomType.images)
          ? roomType.images
          : [];

      const remainingExistingImages =
        images
          .filter(
            (image) =>
              image.type === "existing"
          )
          .map((image) => image.url);

      const removedImages =
        originalImages.filter(
          (url) =>
            !remainingExistingImages.includes(
              url
            )
        );

      // ------------------------------------------
      // 3. Delete removed images from Storage
      // ------------------------------------------

      for (const imageUrl of removedImages) {
        const path =
          getRoomTypeImagePath(imageUrl);

        if (!path) {
          console.warn(
            "Could not determine Storage path for image:",
            imageUrl
          );
          continue;
        }

        const {
          error: deleteError,
        } = await deleteRoomTypeImage(path);

        if (deleteError) {
          throw deleteError;
        }
      }

      // ------------------------------------------
      // 4. Upload new images
      // ------------------------------------------

      const finalImageUrls = [];

      for (const image of images) {
        // Existing image
        if (image.type === "existing") {
          finalImageUrls.push(image.url);
          continue;
        }

        // New image
        const {
          data: uploadedImage,
          error: uploadError,
        } = await uploadRoomTypeImage(
          hotelId,
          roomType.id,
          image.file
        );

        if (uploadError) {
          throw uploadError;
        }

        newlyUploadedPaths.push(
          uploadedImage.path
        );

        finalImageUrls.push(
          uploadedImage.url
        );
      }

      // ------------------------------------------
      // 5. Save final image order
      // ------------------------------------------

      const {
        data: finalRoomType,
        error: imageUpdateError,
      } = await updateRoomTypeImages(
        hotelId,
        roomType.id,
        finalImageUrls
      );

      if (imageUpdateError) {
        throw imageUpdateError;
      }

      // ------------------------------------------
      // 6. Return updated room type
      // ------------------------------------------

      onUpdated?.({
        ...updatedRoomType,
        ...finalRoomType,
        images: finalImageUrls,
        rooms: assignedRooms,
      });

      setSaving(false);
    } catch (submitError) {
      console.error(
        "Failed to update room type:",
        submitError
      );

      // Clean up newly uploaded files
      // if something failed afterward.
      for (const path of newlyUploadedPaths) {
        const {
          error: cleanupError,
        } = await deleteRoomTypeImage(path);

        if (cleanupError) {
          console.error(
            "Failed to clean up uploaded image:",
            cleanupError
          );
        }
      }

      setError(
        submitError?.message ||
          "Failed to update room type."
      );

      setSaving(false);
    }
  }

  if (!roomType) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onClose}
    >
      <div
        className="relative z-101 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Room Type
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the room type information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-7 p-6">
          {/* Error */}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Images */}

          <section>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Room Images
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                The first image is the main image.
                Drag images to change their order.
              </p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {images.map(
                  (image, index) => {
                    const preview =
                      image.type ===
                      "existing"
                        ? image.url
                        : image.preview;

                    return (
                      <div
                        key={
                          image.type ===
                          "existing"
                            ? `${image.url}-${index}`
                            : `${image.file.name}-${image.file.lastModified}-${index}`
                        }
                        draggable
                        onDragStart={() =>
                          handleDragStart(
                            index
                          )
                        }
                        onDragOver={
                          handleDragOver
                        }
                        onDrop={() =>
                          handleDrop(index)
                        }
                        onDragEnd={
                          handleDragEnd
                        }
                        className={`group relative aspect-4/3 overflow-hidden rounded-xl border bg-gray-100 ${
                          draggedIndex ===
                          index
                            ? "opacity-50"
                            : ""
                        }`}
                      >
                        <img
                          src={preview}
                          alt={`Room ${
                            index + 1
                          }`}
                          className="h-full w-full object-cover"
                        />

                        {index === 0 && (
                          <div className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
                            Main
                          </div>
                        )}

                        <div className="absolute bottom-2 left-2 rounded-md bg-black/60 p-1 text-white">
                          <GripVertical
                            size={15}
                          />
                        </div>

                        {image.type ===
                          "new" && (
                          <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
                            New
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(
                              index
                            )
                          }
                          disabled={saving}
                          className="absolute right-2 top-2 rounded-md bg-white/90 p-1.5 text-gray-700 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-white hover:text-red-600 disabled:opacity-50"
                          title="Remove image"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            <div
              className={
                images.length > 0
                  ? "mt-4"
                  : ""
              }
            >
              <button
                type="button"
                onClick={() =>
                  inputRef.current?.click()
                }
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-7 text-sm text-gray-500 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ImagePlus size={20} />

                {images.length
                  ? "Add more images"
                  : "Upload room images"}
              </button>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={
                  handleInputChange
                }
              />

              <p className="mt-2 text-center text-xs text-gray-400">
                JPG, PNG, WEBP, etc. ·
                Maximum 10 MB per image
              </p>
            </div>
          </section>

          {/* Name */}

          <section>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Room Type Name
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <TextField
                label="English"
                value={name.en}
                onChange={(value) =>
                  handleNameChange(
                    "en",
                    value
                  )
                }
                placeholder="Deluxe Room"
                disabled={saving}
              />

              <TextField
                label="French"
                value={name.fr}
                onChange={(value) =>
                  handleNameChange(
                    "fr",
                    value
                  )
                }
                placeholder="Chambre Deluxe"
                disabled={saving}
              />

              <TextField
                label="Arabic"
                value={name.ar}
                onChange={(value) =>
                  handleNameChange(
                    "ar",
                    value
                  )
                }
                placeholder="غرفة ديلوكس"
                disabled={saving}
                dir="rtl"
              />
            </div>
          </section>

          {/* Description */}

          <section>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Description
            </h3>

            <div className="space-y-4">
              <TextAreaField
                label="English"
                value={description.en}
                onChange={(value) =>
                  handleDescriptionChange(
                    "en",
                    value
                  )
                }
                placeholder="Describe the room..."
                disabled={saving}
              />

              <TextAreaField
                label="French"
                value={description.fr}
                onChange={(value) =>
                  handleDescriptionChange(
                    "fr",
                    value
                  )
                }
                placeholder="Décrivez la chambre..."
                disabled={saving}
              />

              <TextAreaField
                label="Arabic"
                value={description.ar}
                onChange={(value) =>
                  handleDescriptionChange(
                    "ar",
                    value
                  )
                }
                placeholder="وصف الغرفة..."
                disabled={saving}
                dir="rtl"
              />
            </div>
          </section>

          {/* Room Information */}

          <section>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Room Information
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <NumberField
                label="Price per night"
                value={price}
                onChange={setPrice}
                min="0"
                step="0.01"
                disabled={saving}
              />

              <NumberField
                label="Capacity"
                value={capacity}
                onChange={setCapacity}
                min="1"
                step="1"
                disabled={saving}
              />

              <NumberField
                label="Size (m²)"
                value={size}
                onChange={setSize}
                min="0"
                step="0.01"
                disabled={saving}
              />
            </div>
          </section>

          {/* Beds */}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Beds
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Specify the type and quantity
                  of each bed.
                </p>
              </div>

              <button
                type="button"
                onClick={addBed}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <Plus size={16} />
                Add bed
              </button>
            </div>

            <div className="space-y-3">
              {beds.map(
                (bed, index) => (
                  <div
                    key={index}
                    className="flex items-end gap-3 rounded-xl border border-gray-200 p-3"
                  >
                    <div className="flex-1">
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Bed type
                      </label>

                      <select
                        value={bed.type}
                        onChange={(event) =>
                          handleBedChange(
                            index,
                            "type",
                            event.target
                              .value
                          )
                        }
                        disabled={saving}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                      >
                        <option value="single">
                          Single
                        </option>

                        <option value="double">
                          Double
                        </option>

                        <option value="queen">
                          Queen
                        </option>

                        <option value="king">
                          King
                        </option>

                        <option value="twin">
                          Twin
                        </option>

                        <option value="sofa_bed">
                          Sofa Bed
                        </option>
                      </select>
                    </div>

                    <div className="w-28">
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Quantity
                      </label>

                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={
                          bed.quantity
                        }
                        onChange={(
                          event
                        ) =>
                          handleBedChange(
                            index,
                            "quantity",
                            event.target
                              .value
                          )
                        }
                        disabled={saving}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeBed(index)
                      }
                      disabled={
                        saving ||
                        beds.length === 1
                      }
                      className="rounded-lg border border-red-200 p-2.5 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Amenities */}

          <section>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Amenities
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                "Wi-Fi",
                "Air Conditioning",
                "TV",
                "Mini Bar",
                "Safe",
                "Hair Dryer",
                "Desk",
                "Balcony",
              ].map((amenity) => {
                const selected =
                  amenities.includes(
                    amenity
                  );

                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() =>
                      toggleAmenity(
                        amenity
                      )
                    }
                    disabled={saving}
                    className={`rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                      selected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Assigned Rooms */}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Assigned Rooms
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Physical rooms currently using
                  this room type.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddRooms(
                    true
                  )
                }
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <Plus size={16} />
                Add Rooms
              </button>
            </div>

            {assignedRooms.length ===
            0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
                <p className="text-sm text-gray-500">
                  No physical rooms are
                  assigned to this room
                  type.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddRooms(
                      true
                    )
                  }
                  disabled={saving}
                  className="mt-3 text-sm font-medium text-gray-900 hover:underline disabled:opacity-50"
                >
                  Add rooms
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {assignedRooms.map(
                  (room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {
                            room.room_number
                          }
                        </p>

                        {room.floor !==
                          null &&
                          room.floor !==
                            undefined && (
                            <p className="mt-0.5 text-xs text-gray-500">
                              Floor{" "}
                              {
                                room.floor
                              }
                            </p>
                          )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveRoom(
                            room
                          )
                        }
                        disabled={
                          saving ||
                          removingRoomId ===
                            room.id
                        }
                        className="rounded-md p-1.5 text-gray-400 transition hover:bg-white hover:text-red-600 disabled:opacity-40"
                        title="Remove room"
                      >
                        <Trash2
                          size={15}
                        />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          {/* Booking Options */}

          <section>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Booking Options
            </h3>

            <div className="space-y-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={
                    freeCancellation
                  }
                  onChange={(event) =>
                    setFreeCancellation(
                      event.target
                        .checked
                    )
                  }
                  disabled={saving}
                  className="h-4 w-4 rounded border-gray-300"
                />

                <span className="text-sm text-gray-700">
                  Free cancellation
                </span>
              </label>

              <div className="max-w-xs">
                <NumberField
                  label="Discount (%)"
                  value={discount}
                  onChange={setDiscount}
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="0"
                  disabled={saving}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>

        {/* Add Rooms Modal */}

        {showAddRooms && (
          <AddRoomsToRoomTypeModal
            hotelId={hotelId}
            roomTypeId={roomType.id}
            onClose={() =>
              setShowAddRooms(false)
            }
            onAdded={
              handleRoomsAdded
            }
          />
        )}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  dir,
  disabled,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        dir={dir}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  dir,
  disabled,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        {label}
      </label>

      <textarea
        rows={3}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        dir={dir}
        disabled={disabled}
        className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  placeholder,
  disabled,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400"
      />
    </div>
  );
}

