import { supabase } from "../supabase";

export async function deleteIssue(id) {
  const { error } = await supabase
    .from("issues")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting issue:", error.message);
    return false;
  }

  return true;
}