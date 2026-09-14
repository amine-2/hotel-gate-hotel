import { supabase } from "../supabase";

export async function getAmenities() {
  const { data, error } = await supabase
    .from("amenities")
    .select("id, name, icon, key")
    .order("key", { ascending: true });

  if (error) {
    console.error("getAmenities error:", error);
    return { data: [], error };
  }

  return { data: data || [], error: null };
}