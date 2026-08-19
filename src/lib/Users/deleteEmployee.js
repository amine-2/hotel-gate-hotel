import { supabase } from "../supabase";

export async function deleteEmployee(id) {
  // 🔥 delete profile
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id);

  if (error) throw error;

  // ⚠️ NOTE:
  // this does NOT delete auth user yet
}