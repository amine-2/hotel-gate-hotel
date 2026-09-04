import { supabase } from "../supabase";

export async function getHotelFloors(hotelId) {
  if (!hotelId) {
    return {
      data: [],
      error: new Error("Hotel ID is required"),
    };
  }

  const { data, error } = await supabase
    .from("rooms")
    .select(`
      id,
      room_number,
      floor,
      room_type_id,
      is_active
    `)
    .eq("hotel_id", hotelId)
    .not("floor", "is", null)
    .order("floor")
    .order("room_number");

  if (error) {
    console.error("getHotelFloors:", error);

    return {
      data: [],
      error,
    };
  }

  const floorsMap = new Map();

  for (const room of data || []) {
    if (!floorsMap.has(room.floor)) {
      floorsMap.set(room.floor, {
        floor: room.floor,
        rooms: [],
      });
    }

    floorsMap.get(room.floor).rooms.push(room);
  }

  const floors = Array.from(floorsMap.values());

  return {
    data: floors,
    error: null,
  };
}