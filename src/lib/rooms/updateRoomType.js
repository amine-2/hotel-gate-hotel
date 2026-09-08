import { supabase } from "../supabase";

export async function updateRoomType(
  hotelId,
  roomTypeId,
  roomType
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

  const payload = {
    name: roomType.name,
    description: roomType.description || null,
    price_per_night: Number(roomType.price_per_night),
    capacity: Number(roomType.capacity),
    beds: roomType.beds || [],
    amenities: roomType.amenities || [],
    free_cancellation: Boolean(roomType.free_cancellation),
    discount:
      roomType.discount === "" ||
      roomType.discount === null
        ? null
        : Number(roomType.discount),
    size: Number(roomType.size) || 0,
  };

  if (!Number.isFinite(payload.price_per_night)) {
    return {
      data: null,
      error: new Error("Invalid price."),
    };
  }

  if (
    !Number.isInteger(payload.capacity) ||
    payload.capacity <= 0
  ) {
    return {
      data: null,
      error: new Error(
        "Capacity must be a whole number greater than 0."
      ),
    };
  }

  if (!Number.isFinite(payload.size) || payload.size < 0) {
    return {
      data: null,
      error: new Error("Invalid room size."),
    };
  }

  const { data, error } = await supabase
    .from("room_types")
    .update(payload)
    .eq("id", roomTypeId)
    .eq("hotel_id", hotelId)
    .select()
    .single();

  if (error) {
    console.error("updateRoomType:", error);

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