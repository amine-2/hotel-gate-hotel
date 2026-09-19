import { supabase } from "../supabase";

function getAlgiersToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Algiers",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function getReceptionistDashboardStats(hotelId) {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  const today = getAlgiersToday();

  const [
    roomsResult,
    occupiedStaysResult,
    arrivalsResult,
    departuresResult,
    currentGuestsResult,
    pendingResult,
  ] = await Promise.all([
    // Total active rooms
    supabase
      .from("rooms")
      .select("id", { count: "exact", head: true })
      .eq("hotel_id", hotelId)
      .eq("is_active", true),

    // Currently occupied rooms
    supabase
      .from("hotel_stays")
      .select("id", { count: "exact", head: true })
      .eq("hotel_id", hotelId)
      .eq("status", "checked_in"),

    // Expected arrivals today
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("hotel_id", hotelId)
      .eq("check_in_date", today)
      .eq("status", "confirmed"),

    // Expected departures today
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("hotel_id", hotelId)
      .eq("check_out_date", today)
      .eq("status", "confirmed"),

    // Current guests
    supabase
      .from("hotel_stays")
      .select(`
        booking:bookings (
          adults,
          children
        )
      `)
      .eq("hotel_id", hotelId)
      .eq("status", "checked_in"),

    // Pending reservations
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("hotel_id", hotelId)
      .eq("status", "pending"),
  ]);

  const results = [
    roomsResult,
    occupiedStaysResult,
    arrivalsResult,
    departuresResult,
    currentGuestsResult,
    pendingResult,
  ];

  const failedResult = results.find((result) => result.error);

  if (failedResult) {
    throw failedResult.error;
  }

  const totalRooms = roomsResult.count || 0;
  const occupiedRooms = occupiedStaysResult.count || 0;

  const currentGuests =
    currentGuestsResult.data?.reduce((total, stay) => {
      const adults = stay.booking?.adults || 0;
      const children = stay.booking?.children || 0;

      return total + adults + children;
    }, 0) || 0;

  return {
    totalRooms,
    occupiedRooms,
    availableRooms: Math.max(totalRooms - occupiedRooms, 0),
    expectedArrivals: arrivalsResult.count || 0,
    expectedDepartures: departuresResult.count || 0,
    currentGuests,
    pendingReservations: pendingResult.count || 0,
  };
}