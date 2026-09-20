import { supabase } from "../supabase";

export async function updateStay({
  hotelId,
  stayId,
  updates,
  userId,
}) {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  if (!stayId) {
    throw new Error("Stay ID is required");
  }

  if (!updates || Object.keys(updates).length === 0) {
    throw new Error("No updates provided");
  }

  const updateData = {
    ...updates,
  };

  if (userId) {
    if (updates.status === "checked_in") {
      updateData.checked_in_by = userId;
    }

    if (updates.status === "checked_out") {
      updateData.checked_out_by = userId;
    }
  }

  if (updates.status === "checked_in" && !updates.checked_in_at) {
    updateData.checked_in_at = new Date().toISOString();
  }

  if (updates.status === "checked_out" && !updates.checked_out_at) {
    updateData.checked_out_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("hotel_stays")
    .update(updateData)
    .eq("id", stayId)
    .eq("hotel_id", hotelId)
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
    console.error("Error updating stay:", error);
    throw error;
  }

  return data;
}