import { supabase } from "../supabase";

export async function createAmenity({ name, icon = null, key }) {
  const payload = {
    name,
    icon,
    key: key?.trim() || "slug",
  };

  const { data, error } = await supabase
    .from("amenities")
    .insert(payload)
    .select("id, name, icon, key")
    .single();

  if (error) {
    console.error("createAmenity error:", error);
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