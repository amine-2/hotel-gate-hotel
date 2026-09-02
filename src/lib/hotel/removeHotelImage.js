import { supabase } from "../supabase";

const BUCKET = "hotels-imgs";

function getStoragePath(imageUrl) {
  if (!imageUrl) return null;

  const marker = `/storage/v1/object/public/${BUCKET}/`;

  const index = imageUrl.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(
    imageUrl.substring(index + marker.length)
  );
}

export async function removeHotelImage(hotelId, imageUrl) {
  if (!hotelId || !imageUrl) {
    return {
      data: null,
      error: new Error(
        "Hotel ID and image URL are required"
      ),
    };
  }

  // Get current images
  const { data: hotel, error: fetchError } =
    await supabase
      .from("hotel_accounts")
      .select("images")
      .eq("id", hotelId)
      .single();

  if (fetchError) {
    return {
      data: null,
      error: fetchError,
    };
  }

  const images = hotel.images || [];

  const updatedImages = images.filter(
    (image) => image !== imageUrl
  );

  // Update database first
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
    return {
      data: null,
      error,
    };
  }

  // Remove actual file from Storage
  const storagePath = getStoragePath(imageUrl);

  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([storagePath]);

    if (storageError) {
      console.error(
        "Failed to remove image from storage:",
        storageError
      );
    }
  }

  return {
    data,
    error: null,
  };
}