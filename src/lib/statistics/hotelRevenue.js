import { supabase } from "../supabase";

/**
 * Fill missing dates per hotel
 */
function fillMissingDatesByHotel(data) {
  if (!data.length) return [];

  const grouped = {};

  // group by hotel
  data.forEach((row) => {
    if (!grouped[row.hotelId]) grouped[row.hotelId] = [];
    grouped[row.hotelId].push(row);
  });

  const result = [];

  Object.values(grouped).forEach((hotelData) => {
    // sort just in case
    hotelData.sort((a, b) => new Date(a.date) - new Date(b.date));

    const map = new Map(hotelData.map((d) => [d.date, d]));

    const start = new Date(hotelData[0].date);
    const end = new Date(hotelData[hotelData.length - 1].date);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);

      result.push(
        map.get(dateStr) || {
          hotelId: hotelData[0].hotelId,
          hotelName: hotelData[0].hotelName,
          date: dateStr,
          revenue: 0,
        },
      );
    }
  });

  return result;
}

/**
 * Fetch revenue per hotel per day (with gap filling)
 */
export async function getHotelRevenue(hotelId) {
  const formatDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const { data, error } = await supabase
    .from("hotel_stats_daily")
    .select(
      `
      hotel_id,
      date,
      total_revenue,
      hotel_accounts (
        name
      )
    `,
    )
    .eq("hotel_id", hotelId)
    .gte("date",formatDate  (oneYearAgo))
    .lte("date", formatDate (today))
    .order("date", { ascending: true });
    
  if (error) {
    console.error("Error fetching revenue data:", error);
    return [];
  }

  // format data
  const formatted = data.map((row) => ({
    hotelId: row.hotel_id,
    hotelName: row.hotel_accounts?.name.en,
    date: row.date,
    revenue: row.total_revenue,
  }));

  // fill missing days
  return fillMissingDatesByHotel(formatted);
}
