import { supabase } from "../supabase";

export async function getRecentCandidates(hotelId, limit = 5) {
  if (!hotelId) {
    return {
      data: [],
      error: new Error("Hotel ID is required"),
    };
  }

  const { data, error } = await supabase
    .from("job_applications")
    .select(`
      id,
      full_name,
      status,
      created_at,
      job_positions (
        title
      )
    `)
    .eq("hotel_id", hotelId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentCandidates:", error);
    return {
      data: [],
      error,
    };
  }

  const candidates = data.map((application) => ({
    id: application.id,
    name: application.full_name,
    position: application.job_positions?.title || "Unknown Position",
    status: application.status,
    createdAt: application.created_at,
  }));

  return {
    data: candidates,
    error: null,
  };
}