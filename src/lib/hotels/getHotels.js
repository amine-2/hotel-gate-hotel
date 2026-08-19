import { supabase } from "../supabase";

export async function getHotels() {
  const { data, error } = await supabase
    .from("hotel_accounts")
    .select("id, name, location, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching hotels:", error);
    return [];
  }

  return data || [];
}