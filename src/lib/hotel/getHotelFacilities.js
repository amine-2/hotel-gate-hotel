import { supabase } from "../supabase";

export async function getHotelFacilities(hotelId) {
  if (!hotelId) {
    return {
      data: [],
      error: new Error("Hotel ID is required"),
    };
  }

  const { data, error } = await supabase
    .from("hotel_facilities")
    .select(`
      facility_id,
      facilities (
        id,
        name,
        icon_url
      )
    `)
    .eq("hotel_id", hotelId);

  return {
    data: data?.map((item) => item.facilities).filter(Boolean) || [],
    error,
  };
}