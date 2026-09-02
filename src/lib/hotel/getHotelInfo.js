import { supabase } from "../supabase";

export async function getHotelInfo(hotelId) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  const { data, error } = await supabase
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

  return { data, error };
}