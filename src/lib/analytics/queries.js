import { supabase } from "../supabase";

/* =========================
   PAGE VIEWS (VISITORS)
   → unique session_id
========================= */

export async function getVisitors(startDate, endDate) {
  let query = supabase.from("page_views").select("session_id");

  if (startDate && endDate) {
    query = query
      .gte("created_at", startDate)
      .lte("created_at", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getVisitors error:", error);
    return 0;
  }

  const safeData = data || [];

  const uniqueSessions = new Set(
    safeData.map((row) => row.session_id)
  );

  return uniqueSessions.size;
}

/* =========================
   HOTEL VIEWS
========================= */

export async function getHotelViews(startDate, endDate) {
  let query = supabase.from("hotel_views").select("hotel_id");

  if (startDate && endDate) {
    query = query
      .gte("created_at", startDate)
      .lte("created_at", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getHotelViews error:", error);
    return 0;
  }

  return data?.length || 0;
}

/* =========================
   BOOKING STARTS
========================= */

export async function getBookingStarts(startDate, endDate) {
  let query = supabase.from("booking_starts").select("hotel_id");

  if (startDate && endDate) {
    query = query
      .gte("created_at", startDate)
      .lte("created_at", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getBookingStarts error:", error);
    return 0;
  }

  return data?.length || 0;
}

/* =========================
   BOOKING CONFIRMED
   → unique booking_id
========================= */

export async function getBookings(startDate, endDate) {
  let query = supabase
    .from("booking_confirmed")
    .select("metadata");

  if (startDate && endDate) {
    query = query
      .gte("created_at", startDate)
      .lte("created_at", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getBookings error:", error);
    return 0;
  }

  const safeData = data || [];

  const uniqueBookings = new Set(
    safeData
      .map((b) => b.metadata?.booking_id)
      .filter(Boolean)
  );

  return uniqueBookings.size;
}

/* =========================
   TOP HOTELS
   → grouped in JS (MVP version)
========================= */

export async function getTopHotels(startDate, endDate) {
  let query = supabase.from("hotel_views").select("hotel_id");

  if (startDate && endDate) {
    query = query
      .gte("created_at", startDate)
      .lte("created_at", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getTopHotels error:", error);
    return [];
  }

  const safeData = data || [];

  const map = {};

  safeData.forEach((item) => {
    map[item.hotel_id] = (map[item.hotel_id] || 0) + 1;
  });

  return Object.entries(map)
    .map(([hotel_id, views]) => ({
      hotel_id,
      views,
    }))
    .sort((a, b) => b.views - a.views);
}