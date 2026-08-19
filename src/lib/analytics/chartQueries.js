import { supabase } from "../supabase";
import  getHotelById  from "../hotels/getHotelById";


export async function getVisitorsChartData() {
  const { data, error } = await supabase
    .from("page_views")
    .select("created_at, session_id")
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(error);
    return [];
  }

  const grouped = {};

  data.forEach((item) => {
    const date = item.created_at.split("T")[0];

    if (!grouped[date]) {
      grouped[date] = new Set();
    }

    grouped[date].add(item.session_id);
  });

  return Object.entries(grouped).map(
    ([date, sessions]) => ({
      date,
      visitors: sessions.size,
    })
  );
}



export async function getHotelViewsChartData() {

  /* =========================
     GET HOTEL VIEWS
  ========================= */

  const { data: views, error } = await supabase
    .from("hotel_views")
    .select("created_at, hotel_id")
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(error);
    return [];
  }

  /* =========================
     GET HOTELS
  ========================= */

  const { data: hotels } = await supabase
    .from("hotel_accounts")
    .select("id, name");

  /* =========================
     CREATE HOTEL MAP
  ========================= */

  const hotelsMap = {};

  hotels?.forEach((hotel) => {
    hotelsMap[hotel.id] =
      hotel.name?.en ||
      hotel.name ||
      "Unknown";
  });

  /* =========================
     FORMAT DATA
  ========================= */

  return views.map((item) => ({
    date: item.created_at.split("T")[0],

    hotelName:
      hotelsMap[item.hotel_id] ||
      "Unknown",

    views: 1,
  }));
}