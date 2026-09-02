import { supabase } from "../supabase";

export async function getFacilities() {
  const { data, error } = await supabase
    .from("facilities")
    .select(`
      id,
      name,
      icon_url
    `)
    .order("name");

  return {
    data: data || [],
    error,
  };
}