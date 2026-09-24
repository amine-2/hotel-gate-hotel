import { supabase } from "../../supabase";

export async function addStayCharge({
  hotelId,
  stayId,
  bookingId,
  roomId,
  item,
}) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  if (!stayId) {
    return {
      data: null,
      error: new Error("Stay ID is required"),
    };
  }

  if (!bookingId) {
    return {
      data: null,
      error: new Error("Booking ID is required"),
    };
  }

  if (!roomId) {
    return {
      data: null,
      error: new Error("Room ID is required"),
    };
  }

  if (!item?.name?.trim()) {
    return {
      data: null,
      error: new Error("Charge name is required"),
    };
  }

  const unitPrice = Number(item.unit_price);
  const quantity = Number(item.quantity);

  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    return {
      data: null,
      error: new Error("Invalid unit price"),
    };
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return {
      data: null,
      error: new Error("Invalid quantity"),
    };
  }

  /*
   * Get the existing charge document.
   *
   * There must only ever be one row per stay.
   */
  const { data: existingCharge, error: existingError } =
    await supabase
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
        finalized_by
      `)
      .eq("stay_id", stayId)
      .eq("hotel_id", hotelId)
      .maybeSingle();

  if (existingError) {
    console.error(
      "addStayCharge - existing charge:",
      existingError
    );

    return {
      data: null,
      error: existingError,
    };
  }

  /*
   * Once the bill has been printed/finalized,
   * it cannot be changed.
   */
  if (existingCharge?.is_finalized) {
    return {
      data: null,
      error: new Error(
        "This bill has already been finalized and cannot be modified."
      ),
    };
  }

  const newItem = {
    id: crypto.randomUUID(),
    name: item.name.trim(),
    unit_price: unitPrice,
    quantity,
    total: Number((unitPrice * quantity).toFixed(2)),
  };

  const existingItems = Array.isArray(existingCharge?.items)
    ? existingCharge.items
    : [];

  const items = [...existingItems, newItem];

  /*
   * Calculate subtotal from all items.
   */
  const subtotal = Number(
    items
      .reduce(
        (sum, chargeItem) =>
          sum +
          Number(chargeItem.unit_price || 0) *
            Number(chargeItem.quantity || 0),
        0
      )
      .toFixed(2)
  );

  const discount = Number(existingCharge?.discount || 0);

  const total = Number(
    Math.max(subtotal - discount, 0).toFixed(2)
  );

  /*
   * Create the single stay_charges row if it doesn't exist.
   */
  if (!existingCharge) {
    const { data, error } = await supabase
      .from("stay_charges")
      .insert({
        hotel_id: hotelId,
        stay_id: stayId,
        booking_id: bookingId,
        room_id: roomId,
        items,
        subtotal,
        discount,
        total,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "addStayCharge - insert:",
        error
      );

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

  /*
   * Update the existing single row.
   */
  const { data, error } = await supabase
    .from("stay_charges")
    .update({
      items,
      subtotal,
      total,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existingCharge.id)
    .eq("hotel_id", hotelId)
    .eq("stay_id", stayId)
    .eq("is_finalized", false)
    .select()
    .single();

  if (error) {
    console.error(
      "addStayCharge - update:",
      error
    );

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