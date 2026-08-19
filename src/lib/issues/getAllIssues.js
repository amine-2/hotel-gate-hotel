import {supabase} from "../supabase";

export async function getAllIssues() {
  const { data, error } = await supabase
    .from("issues")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}