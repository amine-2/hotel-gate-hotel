import { supabase } from "../supabase";

export async function updateEmployee(id, updates) {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}