import { supabase } from "../supabase";

export async function getPositions(hotelId) {
  if (!hotelId) {
    return {
      data: [],
      error: new Error("Hotel ID is required"),
    };
  }

  const { data, error } = await supabase
    .from("job_positions")
    .select("*")
    .eq("hotel_id", hotelId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPositions:", error);
  }

  return {
    data: data || [],
    error,
  };
}