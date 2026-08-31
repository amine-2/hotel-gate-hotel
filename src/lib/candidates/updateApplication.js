import { supabase } from "../supabase";

export async function updateApplication({
  applicationId,
  hotelId,
  full_name,
  email,
  phone,
  address,
  cv_url,
  status,
  notes,
}) {
  if (!applicationId || !hotelId) {
    return {
      data: null,
      error: new Error(
        "Application ID and Hotel ID are required"
      ),
    };
  }

  const updates = {
    full_name: full_name?.trim(),
    email: email?.trim() || null,
    phone: phone?.trim() || null,
    address: address?.trim() || null,
    cv_url: cv_url || null,
    notes: notes?.trim() || null,
  };

  if (status !== undefined) {
    updates.status = status;
  }

  const { data, error } = await supabase
    .from("job_applications")
    .update(updates)
    .eq("id", applicationId)
    .eq("hotel_id", hotelId)
    .select()
    .single();

  if (error) {
    console.error("updateApplication:", error);
  }

  return {
    data,
    error,
  };
}