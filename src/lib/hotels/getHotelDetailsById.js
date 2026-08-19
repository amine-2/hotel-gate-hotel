import { supabase } from "../supabase";

export default async function getHotelDetailsById(hotelId) {
  const { data, error } = await supabase
    .from("hotel_accounts")
    .select(`
      *,
      manager:manager_id (
        full_name,
        avatar_url
      )
       
    `)
    .eq("id", hotelId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return {
    ...data,
    manager_name: data.manager?.full_name,
    manager_avatar: data.manager?.avatar_url
  };
}