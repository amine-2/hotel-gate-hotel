import { supabase } from "../supabase";

function getToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Algiers",
  }).format(new Date());
}

export async function getFrontDeskData(hotelId) {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  const today = getToday();

  // --------------------------------------------------
  // TODAY'S ARRIVALS
  // --------------------------------------------------

  const { data: arrivals, error: arrivalsError } = await supabase
    .from("bookings")
    .select(`
      id,
      name,
      room_id,
      check_in_date,
      check_out_date,
      status,
      channel,
      adults,
      children,
      total_price,
      payment_method,
      phone,

      room:rooms (
        id,
        room_number,
        floor,
        room_type_id,

        room_type:room_types (
          id,
          name
        )
      ),

      hotel_stay:hotel_stays (
        id,
        status,
        checked_in_at,
        checked_out_at
      )
    `)
    .eq("hotel_id", hotelId)
    .eq("check_in_date", today)
    .neq("status", "cancelled")
    .order("created_at", { ascending: true });

  if (arrivalsError) {
    console.error("Failed to load today's arrivals:", arrivalsError);
    throw arrivalsError;
  }

  // --------------------------------------------------
  // TODAY'S DEPARTURES
  // ----------------------------------------------

  const { data: departures, error: departuresError } = await supabase
    .from("bookings")
    .select(`
      id,
      name,
      room_id,
      check_in_date,
      check_out_date,
      status,
      channel,
      adults,
      children,
      total_price,
      payment_method,
      phone,

      room:rooms (
        id,
        room_number,
        floor,
        room_type_id,

        room_type:room_types (
          id,
          name
        )
      ),

      hotel_stay:hotel_stays (
        id,
        status,
        checked_in_at,
        checked_out_at
      )
    `)
    .eq("hotel_id", hotelId)
    .eq("check_out_date", today)
    .neq("status", "cancelled")
    .order("created_at", { ascending: true });

  if (departuresError) {
    console.error("Failed to load today's departures:", departuresError);
    throw departuresError;
  }

  // --------------------------------------------------
  // CURRENTLY STAYING
  // --------------------------------------------------

  const { data: currentStays, error: currentStaysError } = await supabase
    .from("hotel_stays")
    .select(`
      id,
      booking_id,
      hotel_id,
      room_id,
      status,
      checked_in_at,
      checked_out_at,

      booking:bookings (
        id,
        name,
        check_in_date,
        check_out_date,
        adults,
        children,
        total_price,
        payment_method,
        phone,

        room:rooms (
          id,
          room_number,
          floor,

          room_type:room_types (
            id,
            name
          )
        )
      )
    `)
    .eq("hotel_id", hotelId)
    .eq("status", "checked_in")
    .order("checked_in_at", { ascending: true });

  if (currentStaysError) {
    console.error("Failed to load current stays:", currentStaysError);
    throw currentStaysError;
  }

  // --------------------------------------------------
  // PENDING RESERVATIONS
  // --------------------------------------------------

  const { data: pendingReservations, error: pendingError } =
    await supabase
      .from("bookings")
      .select(`
        id,
        name,
        room_id,
        check_in_date,
        check_out_date,
        status,
        channel,
        adults,
        children,
        total_price,

        room:rooms (
          id,
          room_number,
          floor
        )
      `)
      .eq("hotel_id", hotelId)
      .eq("status", "pending")
      .order("check_in_date", { ascending: true })
      .order("created_at", { ascending: true });

  if (pendingError) {
    console.error(
      "Failed to load pending reservations:",
      pendingError
    );

    throw pendingError;
  }

  return {
    today,
    arrivals: arrivals || [],
    departures: departures || [],
    currentStays: currentStays || [],
    pendingReservations: pendingReservations || [],
  };
}

//------------------------------------------
// CLEANUP EXPIRED PENDING RESERVATIONS
//------------------------------------------

export async function cleanupExpiredPendingReservations(hotelId) {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  const today = getToday();

  const { data, error } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
    })
    .eq("hotel_id", hotelId)
    .eq("status", "pending")
    .lt("check_in_date", today)
    .lt("check_out_date", today)
    .select("id");

  if (error) {
    console.error(
      "Failed to clean expired pending reservations:",
      error
    );

    throw error;
  }

  return data || [];
}

//-------------------------------------------
// GET EXPIRED PENDING RESERVATION COUNT
//-------------------------------------------

export async function getExpiredPendingReservationCount(hotelId) {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  const today = getToday();

  const { count, error } = await supabase
    .from("bookings")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("hotel_id", hotelId)
    .eq("status", "pending")
    .lt("check_in_date", today)
    .lt("check_out_date", today);

  if (error) {
    console.error(
      "Failed to get expired pending reservation count:",
      error
    );

    throw error;
  }

  return count || 0;
}