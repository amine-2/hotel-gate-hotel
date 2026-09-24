import { supabase } from "../../supabase";

export async function getRoomDetails(hotelId, roomId) {
  if (!hotelId) {
    return {
      data: null,
      error: new Error("Hotel ID is required"),
    };
  }

  if (!roomId) {
    return {
      data: null,
      error: new Error("Room ID is required"),
    };
  }

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select(
      `
      id,
      hotel_id,
      room_number,
      floor,
      is_active,
      room_type_id,
      room_types (
        id,
        name,
        description,
        capacity,
        price_per_night
      )
    `,
    )
    .eq("id", roomId)
    .eq("hotel_id", hotelId)
    .single();

  if (roomError) {
    console.error("getRoomDetails - room:", roomError);

    return {
      data: null,
      error: roomError,
    };
  }

  /* Get active stays for this room.*/
  const { data: stays, error: staysError } = await supabase
    .from("hotel_stays")
    .select(
      `
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
    `,
    )
    .eq("hotel_id", hotelId)
    .eq("room_id", roomId)
    .in("status", ["reserved", "checked_in"]);

  if (staysError) {
    console.error("getRoomDetails - stays:", staysError);

    return {
      data: null,
      error: staysError,
    };
  }

  /*
   * Get bookings for those stays.
   */
  const bookingIds = [
    ...new Set((stays || []).map((stay) => stay.booking_id).filter(Boolean)),
  ];

  let bookings = [];

  if (bookingIds.length > 0) {
    const { data: bookingData, error: bookingsError } = await supabase
      .from("bookings")
      .select(
        `
        id,
        room_id,
        hotel_id,
        check_in_date,
        check_out_date,
        status,
        name,
        email,
        phone,
        notes,
        adults,
        children,
        price_per_night,
        discount,
        total_price,
        payment_method,
        channel,
        created_at
      `,
      )
      .in("id", bookingIds)
      .eq("hotel_id", hotelId);

    if (bookingsError) {
      console.error("getRoomDetails - booking:", bookingsError);

      return {
        data: null,
        error: bookingsError,
      };
    }

    bookings = bookingData || [];
  }

  /* Current hotel date.*/
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Algiers",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());


  const isReservationActiveToday = (booking) => {
    if (!booking?.check_in_date || !booking?.check_out_date) {
      return false;
    }

    const checkInDate = String(booking.check_in_date).slice(0, 10);
    const checkOutDate = String(booking.check_out_date).slice(0, 10);

    return checkInDate <= today && today < checkOutDate;
  };

  let currentStay = null;
  let currentBooking = null;

  const checkedInStay =
    stays?.find((stay) => stay.status === "checked_in") || null;

  if (checkedInStay) {
    currentStay = checkedInStay;

    currentBooking =
      bookings.find((booking) => booking.id === checkedInStay.booking_id) ||
      null;
  } else {
    const activeReservedStay =
      stays?.find((stay) => {
        if (stay.status !== "reserved") {
          return false;
        }

        const booking = bookings.find((item) => item.id === stay.booking_id);

        return isReservationActiveToday(booking);
      }) || null;

    if (activeReservedStay) {
      currentStay = activeReservedStay;

      currentBooking =
        bookings.find(
          (booking) => booking.id === activeReservedStay.booking_id,
        ) || null;
    }
  }

  /*
   * Calculate the room's current operational status.
   */
  let status = "available";

  if (!room.is_active) {
    status = "inactive";
  } else if (currentStay?.status === "checked_in") {
    status = "occupied";
  } else if (currentStay?.status === "reserved") {
    status = "reserved";
  }

  return {
    data: {
      ...room,
      status,
      currentStay,
      currentBooking,
    },
    error: null,
  };
}
