import { supabase } from "../supabase";

export async function getHRStats(hotelId) {
  if (!hotelId) {
    return {
      data: {
        totalStaff: 0,
        active: 0,
        onLeave: 0,
        candidates: 0,
      },
      error: new Error("Hotel ID is required"),
    };
  }

  // Get staff
  const { data, error } = await supabase
    .from("profiles")
    .select("status, on_leave")
    .eq("hotel_id", hotelId);

  if (error) {
    console.error("getHRStats:", error);

    return {
      data: {
        totalStaff: 0,
        active: 0,
        onLeave: 0,
        candidates: 0,
      },
      error,
    };
  }

  // Get active candidates
  const { count: candidates, error: candidatesError } =
    await supabase
      .from("job_applications")
      .select("id", { count: "exact", head: true })
      .eq("hotel_id", hotelId)
      .not("status", "in", '("accepted","rejected")');

  if (candidatesError) {
    console.error("getHRStats candidates:", candidatesError);

    return {
      data: {
        totalStaff: 0,
        active: 0,
        onLeave: 0,
        candidates: 0,
      },
      error: candidatesError,
    };
  }

  const totalStaff = data.length;

  const active = data.filter(
    (profile) => profile.status === "active"
  ).length;

  const onLeave = data.filter(
    (profile) => profile.on_leave === true
  ).length;

  return {
    data: {
      totalStaff,
      active,
      onLeave,
      candidates: candidates || 0,
    },
    error: null,
  };
}