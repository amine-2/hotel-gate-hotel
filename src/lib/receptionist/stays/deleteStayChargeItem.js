import { supabase } from "../../supabase";

export async function deleteStayChargeItem({
  hotelId,
  stayChargeId,
  itemId,
}) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  if (!stayChargeId) {
    return {
      data: null,
      error: new Error("Stay charge ID is required"),
    };
  }

  if (!itemId) {
    return {
      data: null,
      error: new Error("Charge item ID is required"),
    };
  }

  /*
   * Get the existing charge document.
   */
  const { data: charge, error: chargeError } = await supabase
    .from("stay_charges")
    .select(`
      id,
      items,
      discount,
      is_finalized
    `)
    .eq("id", stayChargeId)
    .eq("hotel_id", hotelId)
    .single();

  if (chargeError) {
    console.error(
      "deleteStayChargeItem - get charge:",
      chargeError
    );

    return {
      data: null,
      error: chargeError,
    };
  }

  /*
   * A printed/finalized bill cannot be modified.
   */
  if (charge.is_finalized) {
    return {
      data: null,
      error: new Error(
        "This bill has already been finalized and cannot be modified."
      ),
    };
  }

  const existingItems = Array.isArray(charge.items)
    ? charge.items
    : [];

  const itemExists = existingItems.some(
    (item) => item.id === itemId
  );

  if (!itemExists) {
    return {
      data: null,
      error: new Error("Charge item not found.")
    };
  }

  /*
   * Remove the selected item.
   */
  const items = existingItems.filter(
    (item) => item.id !== itemId
  );

  /*
   * Recalculate subtotal.
   */
  const subtotal = Number(
    items
      .reduce(
        (sum, item) =>
          sum +
          Number(item.unit_price || 0) *
            Number(item.quantity || 0),
        0
      )
      .toFixed(2)
  );

  const discount = Number(charge.discount || 0);

  const total = Number(
    Math.max(subtotal - discount, 0).toFixed(2)
  );

  /*
   * Update the SAME stay_charges row.
   */
  const { data, error } = await supabase
    .from("stay_charges")
    .update({
      items,
      subtotal,
      total,
      updated_at: new Date().toISOString(),
    })
    .eq("id", stayChargeId)
    .eq("hotel_id", hotelId)
    .eq("is_finalized", false)
    .select()
    .single();

  if (error) {
    console.error(
      "deleteStayChargeItem - update:",
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