import { supabase } from "../supabase";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function uploadRoomTypeImage(hotelId, roomTypeId, file) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  if (!roomTypeId) {
    return {
      data: null,
      error: new Error("Room type ID is required"),
    };
  }

  if (!file) {
    return {
      data: null,
      error: new Error("Image file is required"),
    };
  }

  if (!file.type?.startsWith("image/")) {
    return {
      data: null,
      error: new Error("Only image files are allowed."),
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      data: null,
      error: new Error("Image size must be 10 MB or less."),
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName = `${crypto.randomUUID()}.${extension}`;
  const filePath = `${hotelId}/${roomTypeId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("room-types-imgs")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("uploadRoomTypeImage:", uploadError);

    return {
      data: null,
      error: uploadError,
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("room-types-imgs")
    .getPublicUrl(filePath);

  return {
    data: {
      path: filePath,
      url: publicUrl,
    },
    error: null,
  };
}