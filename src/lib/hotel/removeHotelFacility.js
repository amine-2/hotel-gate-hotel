import { supabase } from "../supabase";

export async function removeHotelFacility(hotelId, facilityId) {
  if (!hotelId || !facilityId) {
    return {
      data: null,
      error: new Error("Hotel ID and facility ID are required"),
    };
  }

  const { data, error } = await supabase
    .from("hotel_facilities")
    .delete()
    .eq("hotel_id", hotelId)
    .eq("facility_id", facilityId);

  return { data, error };
}