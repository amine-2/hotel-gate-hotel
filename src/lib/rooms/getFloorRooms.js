import { supabase } from "../supabase";

export async function getFloorRooms(hotelId, floor) {
  if (!hotelId) {
    return {
      data: [],
      error: new Error("Hotel ID is required"),
    };
  }

  if (floor === null || floor === undefined) {
    return {
      data: [],
      error: new Error("Floor number is required"),
    };
  }

  const { data, error } = await supabase
    .from("rooms")
    .select(`
      id,
      room_number,
      floor,
      room_type_id,
      is_active,
      created_at
    `)
    .eq("hotel_id", hotelId)
    .eq("floor", floor)
    .order("room_number");

  if (error) {
    console.error("getFloorRooms:", error);

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