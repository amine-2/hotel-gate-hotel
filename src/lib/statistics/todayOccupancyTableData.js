import { supabase } from "../supabase";

// ✅ safe local date formatter
const formatDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export async function getTodayOccupancyByHotel() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = formatDate(today);

  const { data, error } = await supabase
    .from("hotel_stats_daily")
    .select(`
      hotel_id,
      total_rooms,
      occupied_rooms,
      empty_rooms,
      hotel_accounts (
        name
      )
    `)
    .eq("date", todayStr);

  if (error) {
    console.error("Error fetching occupancy:", error);
    return [];
  }

  // ✅ format result
  return data.map((row, index) => {
    const rooms = Number(row.total_rooms || 0);
    const occupied = Number(row.occupied_rooms || 0);
    const available = Number(row.empty_rooms || 0);

    // ✅ safe rate calculation
    const rate =
      rooms > 0 ? Math.round((occupied / rooms) * 100) : 0;

    return {
      id: index + 1,
      hotel: row.hotel_accounts?.name?.en || "Unknown",
      rooms,
      occupied,
      available,
      rate,
    };
  });
}