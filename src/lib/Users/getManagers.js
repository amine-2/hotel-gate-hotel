import { supabase } from "../supabase";

export async function getManagers() {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      role,
      status,
      avatar_url,
      hotel_id
    `)
    .eq("role", "hotel_manager");

  if (error) {
    console.error("Error fetching managers:", error.message);
    return [];
  }

  // 🔥 transform avatar_url → public URL
  const enriched = (data || []).map((m) => {
    let avatar = null;

    if (m.avatar_url) {
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(m.avatar_url);

      avatar = urlData.publicUrl;
    }

    return {
      ...m,
      avatar_url: avatar,
    };
  });

  return enriched;
}