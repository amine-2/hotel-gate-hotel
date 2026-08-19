
import { supabase } from "../supabase";

export async function updateHotel(hotelId, updates) {
  const { data, error } = await supabase
    .from("hotel_accounts")
    .update(updates)
    .eq("id", hotelId)
    .select()
    .single();

  if (error) {
    console.error("Error updating hotel:", error.message);
    return null;
  }

  return data;
}