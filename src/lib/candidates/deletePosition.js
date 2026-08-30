import { supabase } from "../supabase";

export async function deletePosition({
  positionId,
  hotelId,
}) {
  if (!positionId || !hotelId) {
    return {
      error: new Error("Position ID and Hotel ID are required"),
    };
  }

  const { error } = await supabase
    .from("job_positions")
    .delete()
    .eq("id", positionId)
    .eq("hotel_id", hotelId);

  if (error) {
    console.error("deletePosition:", error);
  }

  return {
    error,
  };
}