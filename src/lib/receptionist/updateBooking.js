import { supabase } from "../supabase";

export async function updateBooking({
  hotelId,
  bookingId,
  updates,
  userId,
}) {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  if (!updates || Object.keys(updates).length === 0) {
    throw new Error("No updates provided");
  }

  const updateData = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    updateData.updated_by = userId;
  }

  const { data, error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .eq("hotel_id", hotelId)
    .select(`
      id,
      room_id,
      check_in_date,
      check_out_date,
      status,
      created_at,
      updated_at,
      updated_by,
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
      )
    `)
    .single();

  if (error) {
    console.error("Error updating booking:", error);
    throw error;
  }

  return data;
}