import { supabase } from "../supabase";

export async function getSEOPages({ language = "en" }) {
  const { data, error } = await supabase
    .from("seo_pages")
    .select("*")
    .eq("language", language)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("getSEOPages error:", error);
    return [];
  }

  return data;
}