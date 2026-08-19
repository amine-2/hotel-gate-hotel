import { supabase } from "../supabase";

export async function getHotelBookings(hotelId) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("hotel_id", hotelId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error.message);
    return [];
  }
   
  return data || [];
  
}