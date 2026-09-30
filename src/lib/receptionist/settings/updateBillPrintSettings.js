import { supabase } from "../../supabase";

export async function updateBillPrintSettings({
  hotelId,
  printingMethod,
  printerName,
  paperSize,
}) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  if (!["windows", "thermal"].includes(printingMethod)) {
    return {
      data: null,
      error: new Error("Invalid printing method"),
    };
  }

  if (!["58mm", "80mm"].includes(paperSize)) {
    return {
      data: null,
      error: new Error("Invalid paper size"),
    };
  }

  const { data, error } = await supabase
    .from("hotel_bill_print_settings")
    .upsert(
      {
        hotel_id: hotelId,
        printing_method: printingMethod,
        printer_name: printerName?.trim() || null,
        paper_size: paperSize,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "hotel_id",
      }
    )
    .select()
    .single();

  if (error) {
    console.error("updateBillPrintSettings:", error);

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