import { supabase } from "../supabase";

export async function createSEOPage({
  entity_type,
  entity_id = null,
  page_key,
  language = "en",
}) {
  const { data, error } = await supabase
    .from("seo_pages")
    .insert([
      {
        entity_type,
        entity_id,
        page_key,
        language,

        meta_title: "",
        meta_description: "",
        og_title: "",
        og_description: "",
        og_image: "",
        canonical_url: "",

        robots_index: true,
        robots_follow: true,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}