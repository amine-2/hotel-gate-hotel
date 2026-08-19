import { supabase } from "../supabase";

export async function getRoles() {
  const { data, error } = await supabase
    .from("roles")
    .select("id, name, value");

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}