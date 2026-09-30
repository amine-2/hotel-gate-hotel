import { supabase } from "../../supabase";

export async function getBillPrintSettings(hotelId) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  const { data, error } = await supabase
    .from("hotel_bill_print_settings")
    .select(`
      id,
      hotel_id,
      printing_method,
      printer_name,
      paper_size,
      created_at,
      updated_at
    `)
    .eq("hotel_id", hotelId)
    .maybeSingle();

  if (error) {
    console.error("getBillPrintSettings:", error);

    return {
      data: null,
      error,
    };
  }

  return {
    data,
    error: null,
  };
}