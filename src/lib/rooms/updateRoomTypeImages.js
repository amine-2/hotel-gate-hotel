import { supabase } from "../supabase";

export async function updateRoomTypeImages(
  hotelId,
  roomTypeId,
  images
) {
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

  const { data, error } = await supabase
    .from("room_types")
    .update({
      images: images || [],
    })
    .eq("id", roomTypeId)
    .eq("hotel_id", hotelId)
    .select()
    .single();

  if (error) {
    console.error("updateRoomTypeImages:", error);

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