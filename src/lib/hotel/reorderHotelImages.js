import { supabase } from "../supabase";

export async function reorderHotelImages(hotelId, images) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  if (!Array.isArray(images)) {
    return {
      data: null,
      error: new Error("Images must be an array"),
    };
  }

  const { error } = await supabase
    .from("hotel_accounts")
    .update({
      images,
      updated_at: new Date().toISOString(),
    })
    .eq("id", hotelId);

  if (error) {
    console.error("reorderHotelImages:", error);

    return {
      data: null,
      error,
    };
  }

  const { data, error: fetchError } = await supabase
    .from("hotel_accounts")
    .select(`
      id,
      name,
      description,
      location,
      images,
      manager_id,
      created_by,
      created_at,
      rating,
      min_price,
      discount,
      rooms_number,
      status,
      updated_at
    `)
    .eq("id", hotelId)
    .single();

  if (fetchError) {
    return {
      data: null,
      error: fetchError,
    };
  }

  return {
    data,
    error: null,
  };
}