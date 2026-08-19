import { supabase } from "../supabase";
import { generateFromTemplate } from "./templates";

export async function resolveSEO({
  entity_type,
  entity_id,
  page_key,
  language = "en",
  fallbackData = {},
}) {
  // 1. Try manual SEO first
  const { data: seo } = await supabase
    .from("seo_pages")
    .select("*")
    .eq("entity_type", entity_type)
    .eq("entity_id", entity_id)
    .eq("page_key", page_key)
    .eq("language", language)
    .maybeSingle();

  if (seo) return seo;

  // 2. Try template
  const { data: template } = await supabase
    .from("seo_templates")
    .select("*")
    .eq("entity_type", entity_type)
    .single();

  if (template) {
    return generateFromTemplate(template, fallbackData);
  }

  // 3. Fallback defaults
  return {
    meta_title: fallbackData.title || "Hotel Gates",
    meta_description: fallbackData.description || "",
    og_title: fallbackData.title || "",
    og_description: fallbackData.description || "",
    robots_index: true,
    robots_follow: true,
  };
}