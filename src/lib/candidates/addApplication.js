import { supabase } from "../supabase";

export async function addApplication({
  hotelId,
  positionId,
  full_name,
  email,
  phone,
  address,
  cv_url,
  notes,
}) {
  if (!hotelId || !positionId) {
    return {
      data: null,
      error: new Error(
        "Hotel ID and Position ID are required"
      ),
    };
  }

  const { data, error } = await supabase
    .from("job_applications")
    .insert({
      hotel_id: hotelId,
      position_id: positionId,
      full_name: full_name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      cv_url: cv_url || null,
      notes: notes?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error("addApplication:", error);
  }

  return {
    data,
    error,
  };
}