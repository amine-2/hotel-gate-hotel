import { supabase } from "../supabase";

export async function createIssue(issue) {
  const { data, error } = await supabase
    .from("issues")
    .insert([issue])
    .select()
    .single();

  if (error) {
    console.error("Error creating issue:", error.message);
    return null;
  }

  return data;
}