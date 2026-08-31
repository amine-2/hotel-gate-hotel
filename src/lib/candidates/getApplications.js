import { supabase } from "../supabase";

export async function getApplications({
  hotelId,
  positionId,
}) {
  if (!hotelId || !positionId) {
    return {
      data: [],
      error: new Error(
        "Hotel ID and Position ID are required"
      ),
    };
  }

  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("hotel_id", hotelId)
    .eq("position_id", positionId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("getApplications:", error);
  }

  return {
    data: data || [],
    error,
  };
}