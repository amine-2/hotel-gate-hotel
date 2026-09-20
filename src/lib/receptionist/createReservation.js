
import { supabase } from "../supabase";

export async function createReservation({
  hotelId,
  name,
  phone,
  email,
  adults,
  children,
  check_in_date,
  check_out_date,
  room_id,
  price_per_night,
  discount,
  notes,
  payment_method,
}) {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  if (!name?.trim()) {
    throw new Error("Guest name is required");
  }

  if (!room_id) {
    throw new Error("Please select a room");
  }

  if (!check_in_date || !check_out_date) {
    throw new Error("Check-in and check-out dates are required");
  }

  if (check_out_date <= check_in_date) {
    throw new Error("Check-out date must be after check-in date");
  }

  const adultsCount = Number(adults);
  const childrenCount = Number(children) || 0;
  const pricePerNight = Number(price_per_night);
  const discountPercent = Number(discount) || 0;

  if (!Number.isFinite(adultsCount) || adultsCount < 1) {
    throw new Error("At least one adult is required");
  }

  if (!Number.isFinite(childrenCount) || childrenCount < 0) {
    throw new Error("Children count cannot be negative");
  }

  if (!Number.isFinite(pricePerNight) || pricePerNight < 0) {
    throw new Error("Invalid price per night");
  }

  if (
    !Number.isFinite(discountPercent) ||
    discountPercent < 0 ||
    discountPercent > 100
  ) {
    throw new Error("Discount must be between 0% and 100%");
  }

  /*
   * Check that the room still exists and belongs to this hotel.
   */
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, hotel_id, is_active")
    .eq("id", room_id)
    .eq("hotel_id", hotelId)
    .single();

  if (roomError) {
    console.error("Failed to verify room:", roomError);
    throw new Error("Failed to verify the selected room");
  }

  if (!room) {
    throw new Error("Selected room was not found");
  }

  if (!room.is_active) {
    throw new Error("Selected room is not active");
  }

  /*
   * Check again for overlapping pending/confirmed reservations.
   * This protects against another reservation being created
   * after the room list was loaded.
   */
  const { data: overlappingBookings, error: overlapError } = await supabase
    .from("bookings")
    .select("id")
    .eq("hotel_id", hotelId)
    .eq("room_id", room_id)
    .in("status", ["pending", "confirmed"])
    .lt("check_in_date", check_out_date)
    .gt("check_out_date", check_in_date)
    .limit(1);

  if (overlapError) {
    console.error("Failed to check room availability:", overlapError);
    throw new Error("Failed to verify room availability");
  }

  if (overlappingBookings?.length > 0) {
    throw new Error(
      "This room is no longer available for the selected dates"
    );
  }

  /*
   * Calculate nights.
   */
  const start = new Date(`${check_in_date}T00:00:00`);
  const end = new Date(`${check_out_date}T00:00:00`);

  const nights = Math.round(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (nights <= 0) {
    throw new Error("Invalid stay duration");
  }

  /*
   * Discount is a percentage.
   * Example:
   * 15,000 x 7 = 105,000
   * 50% discount = 52,500
   */
  const roomTotal = pricePerNight * nights;
  const discountAmount = roomTotal * (discountPercent / 100);
  const totalPrice = Math.max(0, roomTotal - discountAmount);

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      hotel_id: hotelId,
      room_id,

      name: name.trim(),
      phone: phone?.trim() || null,
      email: email?.trim() || null,

      adults: adultsCount,
      children: childrenCount,

      check_in_date,
      check_out_date,

      price_per_night: pricePerNight,
      discount: discountPercent,
      total_price: totalPrice,

      payment_method: payment_method || "other",
      notes: notes?.trim() || null,

      channel: "onsite",
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create reservation:", error);
    throw error;
  }

  return data;
}

