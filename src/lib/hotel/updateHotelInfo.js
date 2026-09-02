import { supabase } from "../supabase";

export async function updateHotelInfo(hotelId, updates) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  const { error } = await supabase
    .from("hotel_accounts")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", hotelId);

  if (error) {
    console.error("updateHotelInfo:", error);

    return {
      data: null,
      error,
    };
  }

  // Fetch the updated hotel
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
    console.error(
      "Failed to fetch updated hotel:",
      fetchError
    );

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