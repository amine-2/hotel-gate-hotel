import { supabase } from "../supabase";

export async function updatePosition({
  positionId,
  hotelId,
  title,
  description,
  status,
}) {
  if (!positionId || !hotelId) {
    return {
      data: null,
      error: new Error(
        "Position ID and Hotel ID are required"
      ),
    };
  }

  const updates = {
    title: title.trim(),
    description: description?.trim() || null,
  };

  if (status !== undefined) {
    updates.status = status;
  }

  const { data, error } = await supabase
    .from("job_positions")
    .update(updates)
    .eq("id", positionId)
    .eq("hotel_id", hotelId)
    .select()
    .single();

  if (error) {
    console.error("updatePosition:", error);
  }

  return {
    data,
    error,
  };
}