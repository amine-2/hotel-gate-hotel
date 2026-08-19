import { supabase } from "../supabase";

export async function getIssueById(id) {
  const { data, error } = await supabase
    .from("issues")
    .select(
      `
      *,
      hotel:hotel_accounts(id, name),
      creator:profiles!issues_created_by_fkey(id, full_name),
      updater:profiles!issues_updated_by_fkey(id, full_name)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching issue:", error);
    return null;
  }

  return data;
}
