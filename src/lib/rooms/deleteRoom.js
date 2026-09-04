import { supabase } from "../supabase";

export async function deleteRoom(hotelId, roomId) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  if (!roomId) {
    return {
      data: null,
      error: new Error("Room ID is required"),
    };
  }

  const { error } = await supabase
    .from("rooms")
    .delete()
    .eq("id", roomId)
    .eq("hotel_id", hotelId);

  if (error) {
    console.error("deleteRoom:", error);

    return {
      data: null,
      error,
    };
  }

  return {
    data: null,
    error: null,
  };
}