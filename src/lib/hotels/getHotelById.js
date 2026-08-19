import { supabase } from "../supabase";

export default async function getHotelById(hotelId) {
  const { data, error } = await supabase
    .from("hotel_accounts")
    .select("*")
    .eq("id", hotelId)
    .single();

  if (error) {
    console.error("Error fetching hotel:", error);
    return null;
  }

  return data;
}
