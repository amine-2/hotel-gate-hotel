import { supabase } from "../../supabase";

export async function getStayCharges(stayId) {
  if (!stayId) {
    return {
      data: null,
      error: new Error("Stay ID is required"),
    };
  }

  const { data, error } = await supabase
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
    .maybeSingle();

  if (error) {
    console.error("getStayCharges:", error);

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