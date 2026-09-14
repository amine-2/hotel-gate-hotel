// src/lib/amenities/uploadAmenityIcon.js

import { supabase } from "../supabase";

export async function uploadAmenityIcon(file) {
  if (!file) {
    return {
      data: null,
      error: new Error("Icon file is required"),
    };
  }

  if (file.type !== "image/svg+xml") {
    return {
      data: null,
      error: new Error("Only SVG icons are allowed"),
    };
  }

  const fileName = `${crypto.randomUUID()}.svg`;
  const filePath = `amenities/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("amenities-icons")
    .upload(filePath, file, {
      contentType: "image/svg+xml",
      upsert: false,
    });

  if (uploadError) {
    console.error("uploadAmenityIcon error:", uploadError);

    return {
      data: null,
      error: uploadError,
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("amenities-icons")
    .getPublicUrl(filePath);

  return {
    data: {
      path: filePath,
      url: publicUrl,
    },
    error: null,
  };
}