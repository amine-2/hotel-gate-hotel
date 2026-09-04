import { supabase } from "../supabase";

export async function addRoomsToFloor(
  hotelId,
  floor,
  roomNumbers
) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  if (floor === null || floor === undefined) {
    return {
      data: null,
      error: new Error("Floor number is required"),
    };
  }

  if (!Array.isArray(roomNumbers) || roomNumbers.length === 0) {
    return {
      data: null,
      error: new Error("At least one room is required"),
    };
  }

  const rooms = roomNumbers.map((roomNumber) => ({
    hotel_id: hotelId,
    room_number: String(roomNumber).trim(),
    floor: Number(floor),
    room_type_id: null,
    is_active: true,
  }));

  const { data, error } = await supabase
    .from("rooms")
    .insert(rooms)
    .select(`
      id,
      room_number,
      floor,
      room_type_id,
      is_active,
      created_at
    `);

  if (error) {
    console.error("addRoomsToFloor:", error);

    return {
      data: null,
      error,
    };
  }

  return {
    data: data || [],
    error: null,
  };
}