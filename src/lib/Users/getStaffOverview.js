import { supabase } from "../supabase";

export async function getStaffOverview(hotelId) {
  if (!hotelId) {
    return {
      data: [],
      error: new Error("Hotel ID is required"),
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("hotel_id", hotelId)
    .eq("status", "active");

  if (error) {
    console.error("getStaffOverview:", error);

    return {
      data: [],
      error,
    };
  }

  const counts = {};

  data.forEach((profile) => {
    const role = profile.role || "Other";

    counts[role] = (counts[role] || 0) + 1;
  });

  const overview = Object.entries(counts).map(([name, count]) => ({
    name,
    count,
  }));

  return {
    data: overview,
    error: null,
  };
}