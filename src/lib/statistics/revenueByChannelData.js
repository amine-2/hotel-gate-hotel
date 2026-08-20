import { supabase } from "../supabase";

/**
 * Fill missing dates per channel
 */
function fillMissingDatesByChannel(data) {
  if (!data.length) return [];

  const grouped = {};

  // group by channel
  data.forEach((row) => {
    if (!grouped[row.channel]) grouped[row.channel] = [];
    grouped[row.channel].push(row);
  });

  const result = [];

  Object.values(grouped).forEach((channelData) => {
    channelData.sort((a, b) => new Date(a.date) - new Date(b.date));

    const map = new Map(channelData.map((d) => [d.date, d]));

    const start = new Date(channelData[0].date);
    const end = new Date(channelData[channelData.length - 1].date);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);

      result.push(
        map.get(dateStr) || {
          channel: channelData[0].channel,
          date: dateStr,
          revenue: 0,
        },
      );
    }
  });

  return result;
}

/**
 * Fetch revenue by channel
 */
export async function getRevenueByChannelData(hotelId) {

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
    .from("hotel_channel_stats_daily")
    .select(
      `
      date,
      channel,
      total_revenue
    `,
    ).eq("hotel_id", hotelId)
    .gte("date",formatDate  (oneYearAgo))
    .lte("date", formatDate (today))
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching channel revenue:", error);
    return [];
  }

  const formatted = data.map((row) => ({
    channel: row.channel,
    date: row.date,
    revenue: row.total_revenue,
  }));

  return fillMissingDatesByChannel(formatted);
}
