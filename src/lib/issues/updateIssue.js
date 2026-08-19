import { supabase } from "../supabase";

export async function updateIssue(id, updates) {
  const { data, error } = await supabase
    .from("issues")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating issue:", error.message);
    return null;
  }

  return data;
}