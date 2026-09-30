import { supabase } from "../../supabase";

export async function getStayDetails(hotelId, stayId) {
  if (!hotelId || !stayId) {
    return {
      data: null,
      error: new Error("Hotel ID and Stay ID are required"),
    };
  }

  const { data: stay, error: stayError } = await supabase
    .from("hotel_stays")
    .select(`
      id,
      booking_id,
      hotel_id,
      room_id,
      status,
      checked_in_at,
      checked_out_at,
      checked_in_by,
      checked_out_by,
      created_at,

      bookings (
        id,
        room_id,
        check_in_date,
        check_out_date,
        status,
        created_at,
        channel,
        name,
        price_per_night,
        discount,
        total_price,
        email,
        phone,
        notes,
        payment_method,
        adults,
        children,
        updated_by,
        updated_at
      ),

      rooms (
        id,
        room_number,
        floor,
        is_active,

        room_types (
          id,
          hotel_id,
          name,
          description,
          beds,
          price_per_night,
          capacity
        )
      ),

      stay_charges (
        id,
        hotel_id,
        stay_id,
        booking_id,
        room_id,
        items,
        subtotal,
        discount,
        total,
        created_at,
        updated_at,
        is_finalized,
        finalized_at,
        finalized_by
      )
    `)
    .eq("hotel_id", hotelId)
    .eq("id", stayId)
    .single();

  if (stayError) {
    console.error("getStayDetails stay:", stayError);

    return {
      data: null,
      error: stayError,
    };
  }

  const { data: transfers, error: transfersError } = await supabase
    .from("room_transfers")
    .select(`
      id,
      hotel_id,
      stay_id,
      booking_id,
      from_room_id,
      to_room_id,
      difference_amount,
      reason,
      transferred_by,
      transferred_at,

      from_room:rooms!room_transfers_from_room_id_fkey (
        id,
        room_number,
        floor
      ),

      to_room:rooms!room_transfers_to_room_id_fkey (
        id,
        room_number,
        floor
      )
    `)
    .eq("hotel_id", hotelId)
    .eq("stay_id", stayId)
    .order("transferred_at", { ascending: true });

  if (transfersError) {
    console.error("getStayDetails transfers:", transfersError);

    return {
      data: null,
      error: transfersError,
    };
  }

  /*
   * Collect every employee/profile ID we need.
   */
  const profileIds = [
    stay.checked_in_by,
    stay.checked_out_by,
    stay.bookings?.updated_by,
    stay.stay_charges?.finalized_by,
    ...(transfers || []).map((transfer) => transfer.transferred_by),
  ].filter(Boolean);

  const uniqueProfileIds = [...new Set(profileIds)];

  let profiles = [];

  if (uniqueProfileIds.length > 0) {
    const { data: profileData, error: profilesError } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name
      `)
      .in("id", uniqueProfileIds);

    if (profilesError) {
      console.error("getStayDetails profiles:", profilesError);
    } else {
      profiles = profileData || [];
    }
  }

  const profileMap = Object.fromEntries(
    profiles.map((profile) => [
      profile.id,
      profile,
    ])
  );

  return {
    data: {
      ...stay,

      checked_in_profile: profileMap[stay.checked_in_by] || null,

      checked_out_profile: profileMap[stay.checked_out_by] || null,

      booking_updated_by_profile:
        profileMap[stay.bookings?.updated_by] || null,

      finalized_by_profile:
        profileMap[stay.stay_charges?.finalized_by] || null,

      transfers: (transfers || []).map((transfer) => ({
        ...transfer,
        transferred_by_profile:
          profileMap[transfer.transferred_by] || null,
      })),
    },

    error: null,
  };
}