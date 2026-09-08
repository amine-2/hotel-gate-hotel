import { supabase } from "../supabase";

export async function assignRoomsToRoomType(
  hotelId,
  roomTypeId,
  roomIds
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

  if (
    !Array.isArray(roomIds) ||
    roomIds.length === 0
  ) {
    return {
      data: [],
      error: null,
    };
  }

  const { error } = await supabase
    .from("rooms")
    .update({
      room_type_id: roomTypeId,
    })
    .eq("hotel_id", hotelId)
    .in("id", roomIds)
    .is("room_type_id", null);

  if (error) {
    console.error(
      "assignRoomsToRoomType:",
      error
    );

    return {
      data: null,
      error,
    };
  }

  // Fetch the rooms separately after the update.
  const { data, error: fetchError } =
    await supabase
      .from("rooms")
      .select(
        "id, room_number, floor, room_type_id, is_active"
      )
      .eq("hotel_id", hotelId)
      .eq("room_type_id", roomTypeId)
      .in("id", roomIds)
      .order("floor")
      .order("room_number");

  if (fetchError) {
    console.error(
      "assignRoomsToRoomType fetch:",
      fetchError
    );

    return {
      data: null,
      error: fetchError,
    };
  }

  return {
    data: data || [],
    error: null,
  };
}