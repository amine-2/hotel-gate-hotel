import { supabase } from "../supabase";

export async function getRecruitmentStats(hotelId) {
  if (!hotelId) {
    return {
      data: {
        new: 0,
        reviewing: 0,
        interview: 0,
      },
      error: new Error("Hotel ID is required"),
    };
  }

  const { data, error } = await supabase
    .from("job_applications")
    .select("status")
    .eq("hotel_id", hotelId);

  if (error) {
    console.error("getRecruitmentStats:", error);

    return {
      data: {
        new: 0,
        reviewing: 0,
        interview: 0,
      },
      error,
    };
  }

  const newCount = data.filter(
    (application) => application.status === "new"
  ).length;

  const reviewing = data.filter(
    (application) => application.status === "reviewing"
  ).length;

  const interview = data.filter(
    (application) => application.status === "interview"
  ).length;

  return {
    data: {
      new: newCount,
      reviewing,
      interview,
    },
    error: null,
  };
}