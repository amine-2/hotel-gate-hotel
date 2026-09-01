import { supabase } from "../supabase";

export async function getIssuesByHotelNull(hotelId) {
  const { data, error } = await supabase
    .from("issues")
    .select(`
      *,
      hotel:hotel_accounts ( id, name ),
      creator:profiles!issues_created_by_fkey ( id, full_name ),
      updater:profiles!issues_updated_by_fkey ( id, full_name )
    `)
    .or(`hotel_id.eq.${hotelId},hotel_id.is.null`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching issues:", error.message);
    return [];
  }

  return data;
}