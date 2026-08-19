import { supabase } from "../supabase";

export async function createHotel({ name, city, managerId }) {
  // 1. Create hotel

  const { data: userData } = await supabase.auth.getUser();

  const user = userData?.user;
  if (!user) {
    console.error("User not authenticated");
    return null;
  }
  const { data: hotel, error: hotelError } = await supabase
    .from("hotel_accounts")
    .insert({
      name: {
        en: name,
        fr: "",
        ar: "",
      },
      location: {
        city: {
          en: city,
          fr: "",
          ar: "",
        },
      },
      manager_id: managerId || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (hotelError) {
    console.error("Hotel creation failed:", hotelError.message);
    return null;
  }

  // 2. Assign manager if selected
  if (managerId) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        hotel_id: hotel.id,
        role: "hotel_manager", // optional safety sync
      })
      .eq("id", managerId);

    if (updateError) {
      console.error("Manager assign failed:", updateError.message);
    }
  }

  return hotel;
}