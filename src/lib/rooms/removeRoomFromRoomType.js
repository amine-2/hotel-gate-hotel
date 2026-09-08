import { supabase } from "../supabase";

export async function removeRoomFromRoomType(
  hotelId,
  roomTypeId,
  roomId
) {
  if (!hotelId) {
    return {
      error: new Error("Hotel ID is required"),
    };
  }

  if (!roomTypeId) {
    return {
      error: new Error("Room type ID is required"),
    };
  }

  if (!roomId) {
    return {
      error: new Error("Room ID is required"),
    };
  }

  const { error } = await supabase
    .from("rooms")
    .update({
      room_type_id: null,
    })
    .eq("id", roomId)
    .eq("hotel_id", hotelId)
    .eq("room_type_id", roomTypeId);

  if (error) {
    console.error(
      "removeRoomFromRoomType:",
      error
    );

    return { error };
  }

  return {
    error: null,
  };
}