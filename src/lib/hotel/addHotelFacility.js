import { supabase } from "../supabase";

export async function addHotelFacility(hotelId, facilityId) {
  if (!hotelId || !facilityId) {
    return {
      data: null,
      error: new Error("Hotel ID and facility ID are required"),
    };
  }

  const { data, error } = await supabase
    .from("hotel_facilities")
    .insert({
      hotel_id: hotelId,
      facility_id: facilityId,
    })
    .select()
    .single();

  return { data, error };
}