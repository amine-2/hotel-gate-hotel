import { supabase } from "../supabase";

// ✅ local date formatter (NO toISOString)
const formatDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export async function getRevenueByPaymentMethodData(hotelId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const { data, error } = await supabase
    .from("hotel_payment_stats_daily")
    .select(`
      date,
      payment_method,
      total_revenue
    `)
    .eq("hotel_id", hotelId)
    .gte("date", formatDate(oneYearAgo))
    .lte("date", formatDate(today))
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching payment data:", error);
    return [];
  }

  // ✅ format to match your hook
  return data.map((row) => ({
    payment_method: row.payment_method,
    date: row.date,
    revenue: row.total_revenue,
  }));
}