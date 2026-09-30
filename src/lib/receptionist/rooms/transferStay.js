import { supabase } from "../../supabase";

export async function transferStay({
  hotelId,
  stayId,
  toRoomId,
  transferredBy,
  differenceAmount = 0,
  reason = null,
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

  if (!toRoomId) {
    return {
      data: null,
      error: new Error("Destination room is required."),
    };
  }

  if (!transferredBy) {
    return {
      data: null,
      error: new Error("User ID is required."),
    };
  }

  // Get the current stay.
  const { data: stay, error: stayError } = await supabase
    .from("hotel_stays")
    .select(`
      id,
      booking_id,
      hotel_id,
      room_id,
      status
    `)
    .eq("id", stayId)
    .eq("hotel_id", hotelId)
    .single();

  if (stayError) {
    return {
      data: null,
      error: stayError,
    };
  }

  if (stay.status !== "checked_in") {
    return {
      data: null,
      error: new Error("Only a checked-in stay can be transferred."),
    };
  }

  if (stay.room_id === toRoomId) {
    return {
      data: null,
      error: new Error("The guest is already in this room."),
    };
  }

  // Make sure destination room belongs to this hotel and is active.
  const { data: destinationRoom, error: destinationError } = await supabase
    .from("rooms")
    .select(`
      id,
      hotel_id,
      is_active
    `)
    .eq("id", toRoomId)
    .eq("hotel_id", hotelId)
    .single();

  if (destinationError) {
    return {
      data: null,
      error: destinationError,
    };
  }

  if (!destinationRoom.is_active) {
    return {
      data: null,
      error: new Error("The destination room is inactive."),
    };
  }

  // Make sure the destination room does not already have
  // another active stay.
  const { data: conflictingStay, error: conflictError } = await supabase
    .from("hotel_stays")
    .select("id")
    .eq("hotel_id", hotelId)
    .eq("room_id", toRoomId)
    .in("status", ["reserved", "checked_in"])
    .neq("id", stayId)
    .limit(1)
    .maybeSingle();

  if (conflictError) {
    return {
      data: null,
      error: conflictError,
    };
  }

  if (conflictingStay) {
    return {
      data: null,
      error: new Error("The destination room is not available."),
    };
  }

  const fromRoomId = stay.room_id;

  // Update the current physical room.
  const { data: updatedStay, error: updateError } = await supabase
    .from("hotel_stays")
    .update({
      room_id: toRoomId,
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

  if (updateError) {
    return {
      data: null,
      error: updateError,
    };
  }

  // Record the transfer history.
  const { data: transfer, error: transferError } = await supabase
    .from("room_transfers")
    .insert({
      hotel_id: hotelId,
      stay_id: stayId,
      booking_id: stay.booking_id,
      from_room_id: fromRoomId,
      to_room_id: toRoomId,
      difference_amount: Number(differenceAmount) || 0,
      reason: reason || null,
      transferred_by: transferredBy,
    })
    .select(`
      id,
      hotel_id,
      stay_id,
      booking_id,
      from_room_id,
      to_room_id,
      difference_amount,
      reason,
      transferred_by,
      transferred_at
    `)
    .single();

  if (transferError) {
    // Roll the stay back if the transfer history failed.
    await supabase
      .from("hotel_stays")
      .update({
        room_id: fromRoomId,
      })
      .eq("id", stayId)
      .eq("hotel_id", hotelId);

    return {
      data: null,
      error: transferError,
    };
  }

  return {
    data: {
      stay: updatedStay,
      transfer,
    },
    error: null,
  };
}