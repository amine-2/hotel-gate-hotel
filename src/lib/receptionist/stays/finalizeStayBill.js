import { supabase } from "../../supabase";

export async function finalizeStayBill({
  hotelId,
  stayId,
  finalizedBy,
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

  if (!finalizedBy) {
    return {
      data: null,
      error: new Error("Finalized by user is required"),
    };
  }

  const { data: existing, error: existingError } = await supabase
    .from("stay_charges")
    .select(`
      id,
      is_finalized
    `)
    .eq("hotel_id", hotelId)
    .eq("stay_id", stayId)
    .single();

  if (existingError) {
    console.error(
      "finalizeStayBill - get:",
      existingError
    );

    return {
      data: null,
      error: existingError,
    };
  }

  if (existing.is_finalized) {
    return {
      data: existing,
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("stay_charges")
    .update({
      is_finalized: true,
      finalized_at: new Date().toISOString(),
      finalized_by: finalizedBy,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id)
    .eq("hotel_id", hotelId)
    .eq("stay_id", stayId)
    .eq("is_finalized", false)
    .select()
    .single();

  if (error) {
    console.error(
      "finalizeStayBill - update:",
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