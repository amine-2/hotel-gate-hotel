import { supabase } from "../supabase";

export async function getUnassignedRooms(hotelId) {
  if (!hotelId) {
    return {
      data: [],
      error: new Error("Hotel ID is required"),
    };
  }

  const { data, error } = await supabase
    .from("rooms")
    .select("id, room_number, floor, is_active")
    .eq("hotel_id", hotelId)
    .is("room_type_id", null)
    .eq("is_active", true)
    .order("floor")
    .order("room_number");

  if (error) {
    console.error("getUnassignedRooms:", error);

    return {
      data: [],
      error,
    };
  }

  return {
    data: data || [],
    error: null,
  };
}