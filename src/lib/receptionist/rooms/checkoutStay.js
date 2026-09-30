import { supabase } from "../../supabase";

export async function checkoutStay({
  hotelId,
  stayId,
  checkedOutBy,
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

  if (!checkedOutBy) {
    return {
      data: null,
      error: new Error("User ID is required."),
    };
  }

  const { data: stay, error: stayError } = await supabase
    .from("hotel_stays")
    .select(`
      id,
      hotel_id,
      room_id,
      status,
      checked_out_at,
      checked_out_by
    `)
    .eq("id", stayId)
    .eq("hotel_id", hotelId)
    .single();

  if (stayError) {
    console.error("checkoutStay - get stay:", stayError);

    return {
      data: null,
      error: stayError,
    };
  }

  if (stay.status !== "checked_in") {
    return {
      data: null,
      error: new Error(
        "Only a checked-in stay can be checked out.",
      ),
    };
  }

  const { data, error } = await supabase
    .from("hotel_stays")
    .update({
      status: "checked_out",
      checked_out_at: new Date().toISOString(),
      checked_out_by: checkedOutBy,
    })
    .eq("id", stayId)
    .eq("hotel_id", hotelId)
    .eq("status", "checked_in")
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
      created_at
    `)
    .single();

  if (error) {
    console.error("checkoutStay - update stay:", error);

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