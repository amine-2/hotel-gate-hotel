import { supabase } from "../../supabase";

export async function getStayBill(stayId, hotelId) {
  if (!stayId) {
    return {
      data: null,
      error: new Error("Stay ID is required"),
    };
  }

  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  const { data: stay, error: stayError } = await supabase
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
      created_at
    `)
    .eq("id", stayId)
    .eq("hotel_id", hotelId)
    .single();

  if (stayError) {
    console.error("getStayBill - stay:", stayError);

    return {
      data: null,
      error: stayError,
    };
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(`
      id,
      room_id,
      hotel_id,
      check_in_date,
      check_out_date,
      status,
      name,
      email,
      phone,
      notes,
      adults,
      children,
      price_per_night,
      discount,
      total_price,
      payment_method,
      channel,
      created_at
    `)
    .eq("id", stay.booking_id)
    .eq("hotel_id", hotelId)
    .single();

  if (bookingError) {
    console.error("getStayBill - booking:", bookingError);

    return {
      data: null,
      error: bookingError,
    };
  }

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select(`
      id,
      room_number,
      floor,
      room_type_id,
      room_types (
        id,
        name
      )
    `)
    .eq("id", stay.room_id)
    .eq("hotel_id", hotelId)
    .single();

  if (roomError) {
    console.error("getStayBill - room:", roomError);

    return {
      data: null,
      error: roomError,
    };
  }

  const { data: hotel, error: hotelError } = await supabase
    .from("hotel_accounts")
    .select(`
      id,
      name,
      location,
      images
    `)
    .eq("id", hotelId)
    .single();

  if (hotelError) {
    console.error("getStayBill - hotel:", hotelError);

    return {
      data: null,
      error: hotelError,
    };
  }

  const { data: charges, error: chargesError } = await supabase
    .from("stay_charges")
    .select(`
      id,
      hotel_id,
      stay_id,
      booking_id,
      room_id,
      items,
      subtotal,
      discount,
      total,
      is_finalized,
      finalized_at,
      finalized_by,
      created_at,
      updated_at
    `)
    .eq("stay_id", stayId)
    .eq("hotel_id", hotelId)
    .maybeSingle();

  if (chargesError) {
    console.error("getStayBill - charges:", chargesError);

    return {
      data: null,
      error: chargesError,
    };
  }

  return {
    data: {
      stay,
      booking,
      room,
      hotel,
      charges,
    },
    error: null,
  };
}