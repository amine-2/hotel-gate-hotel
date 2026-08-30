import { supabase } from "../supabase";

export async function addPosition({
  hotelId,
  title,
  description,
}) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  const { data, error } = await supabase
    .from("job_positions")
    .insert({
      hotel_id: hotelId,
      title: title.trim(),
      description: description?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error("addPosition:", error);
  }

  return {
    data,
    error,
  };
}