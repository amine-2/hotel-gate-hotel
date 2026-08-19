import { supabase } from "../supabase";

export async function getHotelStatsDaily(hotelId) {
  const { data, error } = await supabase
    .from("hotel_stats_daily")
    .select("*")
    .eq("hotel_id", hotelId)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching hotel stats:", error.message);
    return [];
  }

  return data || [];
}