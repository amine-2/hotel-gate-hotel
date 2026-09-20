import { supabase } from "../supabase";

export async function getReservations({
  hotelId,
  status = "all",
  search = "",
}) {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  let query = supabase
    .from("bookings")
    .select(
      `
      id,
      room_id,
      check_in_date,
      check_out_date,
      status,
      created_at,
      channel,
      name,
      price_per_night,
      discount,
      total_price,
      email,
      phone,
      notes,
      payment_method,
      adults,
      children,
      updated_at,
      room:rooms (
        room_number,
        floor
      )
    `,
    )
    .eq("hotel_id", hotelId)
    .order("check_in_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }

  let reservations = data || [];

  const searchValue = search.trim().toLowerCase();

  if (searchValue) {
    reservations = reservations.filter((booking) => {
      const guestName = booking.name?.toLowerCase() || "";
      const bookingId = booking.id?.toLowerCase() || "";
      const roomNumber =
        booking.room?.room_number?.toString().toLowerCase() || "";
      const phone = booking.phone?.toLowerCase() || "";
      const email = booking.email?.toLowerCase() || "";

      return (
        guestName.includes(searchValue) ||
        bookingId.includes(searchValue) ||
        roomNumber.includes(searchValue) ||
        phone.includes(searchValue) ||
        email.includes(searchValue)
      );
    });
  }

  return reservations;
}
