import { supabase } from "../supabase";

const BUCKET = "hotels-imgs";

export async function addHotelImage(hotelId, file) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  if (!file) {
    return {
      data: null,
      error: new Error("Image file is required"),
    };
  }

  if (!file.type.startsWith("image/")) {
    return {
      data: null,
      error: new Error("Only image files are allowed"),
    };
  }

  // 10 MB limit
  if (file.size > 10 * 1024 * 1024) {
    return {
      data: null,
      error: new Error("Image must be smaller than 10 MB"),
    };
  }

  /*
   * Keep each hotel's images inside its own folder.
   *
   * Example:
   * hotel-id/
   *   uuid-image.jpg
   */
  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const filePath = `${hotelId}/${crypto.randomUUID()}.${extension}`;

  // Upload image
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Image upload error:", uploadError);

    return {
      data: null,
      error: uploadError,
    };
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  const imageUrl = publicUrlData?.publicUrl;

  if (!imageUrl) {
    return {
      data: null,
      error: new Error("Could not generate image URL"),
    };
  }

  // Get current images
  const { data: hotel, error: hotelError } = await supabase
    .from("hotel_accounts")
    .select("images")
    .eq("id", hotelId)
    .single();

  if (hotelError) {
    // Upload succeeded but database lookup failed.
    // Clean up the uploaded file.
    await supabase.storage
      .from(BUCKET)
      .remove([filePath]);

    return {
      data: null,
      error: hotelError,
    };
  }

  const images = hotel.images || [];

  // Add image to the end.
  const updatedImages = [...images, imageUrl];

  const { data, error } = await supabase
    .from("hotel_accounts")
    .update({
      images: updatedImages,
      updated_at: new Date().toISOString(),
    })
    .eq("id", hotelId)
    .select()
    .single();

  if (error) {
    // Database update failed, remove uploaded image.
    await supabase.storage
      .from(BUCKET)
      .remove([filePath]);

    return {
      data: null,
      error,
    };
  }

  return {
    data,
    error: null,
  };
}