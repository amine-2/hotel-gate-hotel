import { supabase } from "../supabase";


export async function getRoomTypes(hotelId) {
  if (!hotelId) {
    return {
      data: [],
      error: new Error("Hotel ID is required"),
    };
  }

  const { data, error } = await supabase
    .from("room_types")
    .select(`
      id,
      hotel_id,
      name,
      description,
      price_per_night,
      capacity,
      beds,
      amenities,
      images,
      rating,
      free_cancellation,
      discount,
      size,
      status,
      created_at,
      rooms (
        id,
        room_number,
        floor,
        is_active
      )
    `)
    .eq("hotel_id", hotelId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getRoomTypes:", error);

    return {
      data: [],
      error,
    };
  }

  return {
    data: data || [],
    error: null,
  };
}