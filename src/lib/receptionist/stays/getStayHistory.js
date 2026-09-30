import { supabase } from "../../supabase";

export async function getStayHistory(hotelId, roomId = null) {
  if (!hotelId) {
    return {
      data: [],
      error: new Error("Hotel ID is required"),
    };
  }

  let query = supabase
    .from("hotel_stays")
    .select(`
      id,
      booking_id,
      hotel_id,
      room_id,
      status,
      checked_in_at,
      checked_out_at,
      checked_in_by,
      checked_out_by,
      created_at,

      bookings (
        id,
        name,
        email,
        phone,
        check_in_date,
        check_out_date,
        status,
        channel,
        price_per_night,
        discount,
        total_price,
        payment_method,
        adults,
        children,
        notes,
        created_at,
        updated_at
      ),

      rooms (
        id,
        room_number,
        floor,
        is_active,

        room_types (
          id,
          name,
          price_per_night,
          capacity
        )
      )
    `)
    .eq("hotel_id", hotelId)
    .eq("status", "checked_out")
    .order("checked_out_at", { ascending: false });

  if (roomId) {
    query = query.eq("room_id", roomId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getStayHistory:", error);

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