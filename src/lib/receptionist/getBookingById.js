import { supabase } from "../supabase";

export async function getBookingById({ hotelId, bookingId }) {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id,
      hotel_id,
      room_id,
      check_in_date,
      check_out_date,
      status,
      created_at,
      updated_at,
      channel,
      name,
      price_per_night,
      discount,
      total_price,
      email,
      phone,
      notes,
      payment_method,
      adults,
      children,

      room:rooms (
        id,
        room_number,
        floor,
        room_type_id
      ),

      hotel_stay:hotel_stays (
        id,
        status,
        checked_in_at,
        checked_out_at,
        checked_in_by,
        checked_out_by,
        created_at
      )
    `)
    .eq("hotel_id", hotelId)
    .eq("id", bookingId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Booking not found");
  }

  return data;
}