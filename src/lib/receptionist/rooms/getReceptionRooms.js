import { supabase } from "../../supabase";

export async function getReceptionRooms(hotelId) {
  if (!hotelId) {
    return {
      data: [],
      error: new Error("Hotel ID is required"),
    };
  }

  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select(`
      id,
      room_number,
      floor,
      is_active,
      room_type_id,
      room_types (
        id,
        name,
        capacity
      )
    `)
    .eq("hotel_id", hotelId)
    .order("floor", { ascending: true })
    .order("room_number", { ascending: true });

  if (roomsError) {
    console.error("getReceptionRooms - rooms:", roomsError);

    return {
      data: [],
      error: roomsError,
    };
  }

  if (!rooms?.length) {
    return {
      data: [],
      error: null,
    };
  }

  const roomIds = rooms.map((room) => room.id);

  /*
   * Get active hotel stays.
   *
   * Only these statuses can affect the current room board:
   * - reserved
   * - checked_in
   */
  const { data: stays, error: staysError } = await supabase
    .from("hotel_stays")
    .select(`
      id,
      booking_id,
      hotel_id,
      room_id,
      status,
      checked_in_at,
      checked_out_at,
      checked_in_by,
      checked_out_by,
      created_at
    `)
    .eq("hotel_id", hotelId)
    .in("room_id", roomIds)
    .in("status", ["reserved", "checked_in"]);

  if (staysError) {
    console.error("getReceptionRooms - hotel_stays:", staysError);

    return {
      data: [],
      error: staysError,
    };
  }

  /*
   * Get the bookings belonging to those stays.
   */
  const bookingIds = [
    ...new Set(
      (stays || [])
        .map((stay) => stay.booking_id)
        .filter(Boolean)
    ),
  ];

  let bookings = [];

  if (bookingIds.length > 0) {
    const {
      data: bookingData,
      error: bookingsError,
    } = await supabase
      .from("bookings")
      .select(`
        id,
        room_id,
        check_in_date,
        check_out_date,
        status,
        name,
        email,
        phone,
        price_per_night,
        discount,
        total_price,
        payment_method,
        channel
      `)
      .in("id", bookingIds);

    if (bookingsError) {
      console.error(
        "getReceptionRooms - bookings:",
        bookingsError
      );

      return {
        data: [],
        error: bookingsError,
      };
    }

    bookings = bookingData || [];
  }

  /*
   * Current date in the hotel's timezone.
   *
   * Hotel Gates uses Africa/Algiers for booking dates.
   *
   * We only need the calendar date here because
   * check_in_date / check_out_date represent hotel stay dates.
   */
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Algiers",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  /*
   * A reservation affects the current room board only when
   * today falls inside the booking period:
   *
   * check_in_date <= today
   * AND
   * today < check_out_date
   *
   * Example:
   *
   * Sep 20 -> Sep 25
   *
   * Sep 19  = Available
   * Sep 20  = Reserved
   * Sep 24  = Reserved
   * Sep 25  = Available
   */
  const isReservationActiveToday = (booking) => {
    if (!booking?.check_in_date || !booking?.check_out_date) {
      return false;
    }

    const checkInDate = String(booking.check_in_date).slice(0, 10);
    const checkOutDate = String(booking.check_out_date).slice(0, 10);

    return checkInDate <= today && today < checkOutDate;
  };

  /*
   * Attach the relevant stay and booking to each room.
   */
  const roomsWithStatus = rooms.map((room) => {
    const currentStay =
      stays?.find((stay) => stay.room_id === room.id) || null;

    const currentBooking = currentStay
      ? bookings.find(
          (booking) => booking.id === currentStay.booking_id
        ) || null
      : null;

    let status = "available";

    if (!room.is_active) {
      status = "inactive";
    } else if (currentStay?.status === "checked_in") {
      status = "occupied";
    } else if (
      currentStay?.status === "reserved" &&
      isReservationActiveToday(currentBooking)
    ) {
      status = "reserved";
    }

    return {
      ...room,
      status,
      currentStay,
      currentBooking,
    };
  });

  return {
    data: roomsWithStatus,
    error: null,
  };
}