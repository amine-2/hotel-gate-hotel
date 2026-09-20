import { supabase } from "../supabase";

export async function getAvailableRooms({
  hotelId,
  checkInDate,
  checkOutDate,
}) {
 
  

  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  if (!checkInDate || !checkOutDate) {
    return [];
  }

  if (checkOutDate <= checkInDate) {
    return [];
  }
 
  // -----------------------------------------
  // 1. Get ALL active physical rooms
  // -----------------------------------------

  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select(
      `
      id,
      room_number,
      floor,
      room_type_id,
      is_active
    `,
    )
    .eq("hotel_id", hotelId)
    .eq("is_active", true)
    .order("floor", { ascending: true })
    .order("room_number", { ascending: true });

  if (roomsError) {
    console.error("❌ Rooms error:", roomsError);
    throw roomsError;
  }

  
  if (!rooms || rooms.length === 0) {
    return [];
  }

  // -----------------------------------------
  // 2. Get bookings overlapping the dates
  // -----------------------------------------

  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select(
      `
      id,
      room_id,
      check_in_date,
      check_out_date,
      status
    `,
    )
    .eq("hotel_id", hotelId)
    .in("status", ["pending", "confirmed"])
    .lt("check_in_date", checkOutDate)
    .gt("check_out_date", checkInDate);

  if (bookingsError) {
    console.error("❌ Bookings error:", bookingsError);
    throw bookingsError;
  }

  // -----------------------------------------
  // 3. Remove only physically unavailable rooms
  // -----------------------------------------

  const occupiedRoomIds = new Set(
    (bookings || []).map((booking) => booking.room_id),
  );

  const availableRooms = rooms.filter((room) => !occupiedRoomIds.has(room.id));


  /// -----------------------------------------
  // 4. Get optional room types
  // -----------------------------------------

  const roomTypeIds = [
    ...new Set(availableRooms.map((room) => room.room_type_id).filter(Boolean)),
  ];


  let roomTypes = [];

  if (roomTypeIds.length > 0) {
    const { data, error } = await supabase
      .from("room_types")
      .select("id, name, description, capacity, price_per_night, hotel_id");

    if (error) {
      console.error("❌ ROOM TYPES QUERY FAILED:", error);
      throw error;
    }

    roomTypes = data || [];
  }

  // -----------------------------------------
  // 5. Match room → optional room type
  // -----------------------------------------

  const roomTypeMap = new Map(
    roomTypes.map((roomType) => [roomType.id, roomType]),
  );

  const result = availableRooms.map((room) => {
    const roomType = room.room_type_id
      ? roomTypeMap.get(room.room_type_id) || null
      : null;
    return {
      ...room,
      room_type: roomType,
    };
  });

  return result;
}
