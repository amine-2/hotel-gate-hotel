import { supabase } from "../supabase";

export async function deleteRoomType(hotelId, roomTypeId) {
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

  const { error } = await supabase
    .from("room_types")
    .delete()
    .eq("id", roomTypeId)
    .eq("hotel_id", hotelId);

  if (error) {
    console.error("deleteRoomType:", error);
    return { error };
  }

  return { error: null };
}