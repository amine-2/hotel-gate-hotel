import { supabase } from "../supabase";

export async function getGlobalStats() {
  const { data, error } = await supabase
    .from("global_stats_daily") // your table name
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching global stats:", error);
    return [];
  }

  return data;
}