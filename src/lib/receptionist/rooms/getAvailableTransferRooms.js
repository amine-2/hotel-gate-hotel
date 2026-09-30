import { supabase } from "../../supabase";

export async function getAvailableTransferRooms({
  hotelId,
  stayId,
}) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required."),
    };
  }

  if (!stayId) {
    return {
      data: null,
      error: new Error("Stay ID is required."),
    };
  }

  // Get the current stay.
  const { data: stay, error: stayError } = await supabase
    .from("hotel_stays")
    .select(`
      id,
      room_id,
      booking_id,
      status
    `)
    .eq("id", stayId)
    .eq("hotel_id", hotelId)
    .single();

  if (stayError) {
    return { data: null, error: stayError };
  }

  if (stay.status !== "checked_in") {
    return {
      data: [],
      error: new Error("Only a checked-in stay can be transferred."),
    };
  }

  // Get all active rooms in this hotel.
  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select(`
      id,
      room_number,
      floor,
      is_active,
      room_type_id,
      room_types (
        id,
        name,
        price_per_night,
        capacity
      )
    `)
    .eq("hotel_id", hotelId)
    .eq("is_active", true)
    .order("floor", { ascending: true })
    .order("room_number", { ascending: true });

  if (roomsError) {
    return { data: null, error: roomsError };
  }

  // Get currently active stays.
  const { data: activeStays, error: staysError } = await supabase
    .from("hotel_stays")
    .select(`
      id,
      room_id,
      status
    `)
    .eq("hotel_id", hotelId)
    .in("status", ["reserved", "checked_in"]);

  if (staysError) {
    return { data: null, error: staysError };
  }

  const occupiedRoomIds = new Set(
    (activeStays || [])
      .filter((item) => item.id !== stayId)
      .map((item) => item.room_id)
      .filter(Boolean),
  );

  const availableRooms = (rooms || [])
    .filter((room) => room.id !== stay.room_id)
    .filter((room) => !occupiedRoomIds.has(room.id))
    .map((room) => ({
      ...room,
      room_type: room.room_types || null,
    }));

  return {
    data: availableRooms,
    error: null,
  };
}