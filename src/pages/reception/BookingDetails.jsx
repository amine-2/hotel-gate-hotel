import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookingConfirmationPDF from "../../components/reception/reservations/BookingConfirmationPDF";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  XCircle,
} from "lucide-react";

import { useAuth } from "../../auth/AuthContext";
import { useHotel } from "../../auth/HotelContext";

import { getBookingById } from "../../lib/receptionist/getBookingById";
import { updateBooking } from "../../lib/receptionist/updateBooking";
import { supabase } from "../../lib/supabase";
import { updateStay } from "../../lib/receptionist/updateStay";
import EditReservationModal from "../../components/reception/reservations/EditReservationModal";

export default function BookingDetails() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const { hotelId } = useHotel();
  const { user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!hotelId || !bookingId) return;

    async function loadBooking() {
      try {
        setLoading(true);
        setError("");

        const data = await getBookingById({
          hotelId,
          bookingId,
        });

        setBooking(data);
      } catch (err) {
        console.error("Failed to load booking:", err);
        setError(err.message || "Failed to load booking");
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [hotelId, bookingId]);

  useEffect(() => {
    if (!hotelId) return;

    const loadHotel = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("hotel_accounts")
        .select("*")
        .eq("id", hotelId)
        .single();

      if (error) {
        console.error("Failed to load hotel:", error);
        setError("Failed to load hotel information.");
      } else {
        setHotel(data);
      }

      setLoading(false);
    };

    loadHotel();
  }, [hotelId]);

  async function handleConfirm() {
    if (!booking) return;

    try {
      setActionLoading(true);
      setError("");

      const updatedBooking = await updateBooking({
        hotelId,
        bookingId: booking.id,
        userId: user?.id,
        updates: {
          status: "confirmed",
        },
      });

      setBooking((current) => ({
        ...current,
        ...updatedBooking,
      }));
    } catch (err) {
      console.error("Failed to confirm booking:", err);
      setError(err.message || "Failed to confirm booking");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckIn() {
    if (!booking || !stay) {
      setError("No active stay found for this reservation.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const updatedStay = await updateStay({
        hotelId,
        stayId: stay.id,
        userId: user?.id,
        updates: {
          status: "checked_in",
        },
      });

      setBooking((current) => ({
        ...current,
        hotel_stay: updatedStay,
      }));
    } catch (err) {
      console.error("Failed to check in:", err);
      setError(err.message || "Failed to check in guest");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckOut() {
    if (!booking || !stay) return;

    const confirmed = window.confirm(
      "Are you sure you want to check out this guest?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      const updatedStay = await updateStay({
        hotelId,
        stayId: stay.id,
        userId: user?.id,
        updates: {
          status: "checked_out",
        },
      });

      setBooking((current) => ({
        ...current,
        hotel_stay: updatedStay,
      }));
    } catch (err) {
      console.error("Failed to check out:", err);
      setError(err.message || "Failed to check out guest");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleEditSave(updates) {
    if (!booking) return;

    try {
      setActionLoading(true);
      setError("");

      await updateBooking({
        hotelId,
        bookingId: booking.id,
        userId: user?.id,
        updates,
      });

      const refreshedBooking = await getBookingById({
        hotelId,
        bookingId: booking.id,
      });

      setBooking(refreshedBooking);
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update reservation:", err);
      setError(err.message || "Failed to update reservation");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!booking) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      const updatedBooking = await updateBooking({
        hotelId,
        bookingId: booking.id,
        userId: user?.id,
        updates: {
          status: "cancelled",
        },
      });

      setBooking((current) => ({
        ...current,
        ...updatedBooking,
      }));
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      setError(err.message || "Failed to cancel booking");
    } finally {
      setActionLoading(false);
    }
  }
  function handleBack() {
    navigate("/dashboard/reception/reservations");
  }

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center p-8">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading booking...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-full flex-col p-8 pt-16 pl-16">
        <div className="mx-auto w-[95%]">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <ArrowLeft size={18} />
            Back to Reservations
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const stay = Array.isArray(booking.hotel_stay)
    ? booking.hotel_stay[0]
    : booking.hotel_stay;

  const guestCount = (booking.adults || 0) + (booking.children || 0);

  const statusStyles = {
    confirmed:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",

    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",

    cancelled: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  };

  const stayStatusStyles = {
    reserved: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",

    checked_in:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",

    checked_out:
      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",

    cancelled: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",

    no_show:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  };

  return (
    <div className="flex min-h-full flex-col p-8 pt-16 pl-16">
      <div className="mx-auto w-[95%]">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <ArrowLeft size={18} />
            Back to Reservations
          </button>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200">
                  {booking.name}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    statusStyles[booking.status] || "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Booking #{booking.id}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {booking.status === "pending" && (
                <>
                  <button
                    onClick={handleConfirm}
                    disabled={actionLoading}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle size={17} />
                    {actionLoading ? "Processing..." : "Confirm"}
                  </button>

                  <button
                    onClick={() => setShowEditModal(true)}
                    disabled={actionLoading}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    Edit
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={actionLoading}
                    className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <XCircle size={17} />
                    Cancel
                  </button>
                </>
              )}
              {booking.status === "confirmed" &&
                stay?.status === "reserved" && (
                  <>
                    <button
                      onClick={handleCheckIn}
                      disabled={actionLoading}
                      className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      <CheckCircle size={17} />
                      {actionLoading ? "Processing..." : "Check-in"}
                    </button>

                    <button
                      onClick={() => setShowEditModal(true)}
                      disabled={actionLoading}
                      className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                      Edit
                    </button>
                  </>
                )}
              {booking.status === "confirmed" &&
                stay?.status === "checked_in" && (
                  <>
                    <button
                      onClick={handleCheckOut}
                      disabled={actionLoading}
                      className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      <CheckCircle size={17} />
                      {actionLoading ? "Processing..." : "Check-out"}
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 xl:col-span-2">
            {/* Guest */}
            <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
              <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-700">
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                  Guest Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                <InfoItem
                  icon={<User size={18} />}
                  label="Full Name"
                  value={booking.name}
                />

                <InfoItem
                  icon={<Users size={18} />}
                  label="Guests"
                  value={`${guestCount} total (${booking.adults || 0} adults, ${
                    booking.children || 0
                  } children)`}
                />

                <InfoItem
                  icon={<Phone size={18} />}
                  label="Phone"
                  value={booking.phone || "—"}
                />

                <InfoItem
                  icon={<Mail size={18} />}
                  label="Email"
                  value={booking.email || "—"}
                />
              </div>
            </section>

            {/* Stay */}
            <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
              <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-700">
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                  Stay Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                <InfoItem
                  icon={<MapPin size={18} />}
                  label="Room"
                  value={
                    booking.room?.room_number
                      ? `Room ${booking.room.room_number}`
                      : "—"
                  }
                />

                <InfoItem
                  icon={<MapPin size={18} />}
                  label="Floor"
                  value={
                    booking.room?.floor !== null &&
                    booking.room?.floor !== undefined
                      ? `Floor ${booking.room.floor}`
                      : "—"
                  }
                />

                <InfoItem
                  icon={<CalendarDays size={18} />}
                  label="Check-in"
                  value={booking.check_in_date}
                />

                <InfoItem
                  icon={<CalendarDays size={18} />}
                  label="Check-out"
                  value={booking.check_out_date}
                />
              </div>

              {stay && (
                <div className="border-t border-zinc-200 px-6 py-5 dark:border-zinc-700">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        Stay Status
                      </p>

                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Operational status of the guest's stay
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        stayStatusStyles[stay.status] ||
                        "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {stay.status?.replace("_", " ")}
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Notes */}
            <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
              <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-700">
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                  Notes
                </h2>
              </div>

              <div className="p-6">
                {booking.notes ? (
                  <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {booking.notes}
                  </p>
                ) : (
                  <p className="text-sm text-zinc-400">No notes added.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Pricing */}
            <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
              <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-700">
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                  Payment & Pricing
                </h2>
              </div>

              <div className="space-y-5 p-6">
                <InfoItem
                  icon={<CreditCard size={18} />}
                  label="Payment Method"
                  value={booking.payment_method || "Other"}
                />

                <div>
                  <p className="text-xs font-medium text-zinc-400">
                    Price per Night
                  </p>

                  <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {booking.price_per_night ?? 0}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-zinc-400">Discount</p>

                  <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {booking.discount ?? 0}
                  </p>
                </div>

                <div className="border-t border-zinc-200 pt-5 dark:border-zinc-700">
                  <p className="text-xs font-medium text-zinc-400">Total</p>

                  <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {booking.total_price ?? 0}
                  </p>
                </div>
              </div>
            </section>

            {/* Booking info */}
            <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
              <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-700">
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                  Reservation Details
                </h2>
              </div>

              <div className="space-y-5 p-6">
                <InfoItem
                  icon={<Clock size={18} />}
                  label="Channel"
                  value={booking.channel || "Online"}
                />

                <InfoItem
                  icon={<CalendarDays size={18} />}
                  label="Created"
                  value={
                    booking.created_at
                      ? new Date(booking.created_at).toLocaleString()
                      : "—"
                  }
                />

                <InfoItem
                  icon={<Clock size={18} />}
                  label="Last Updated"
                  value={
                    booking.updated_at
                      ? new Date(booking.updated_at).toLocaleString()
                      : "—"
                  }
                />
              </div>
            </section>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <BookingConfirmationPDF
            bookingId={booking.id}
            guestName={booking.name}
            hotelName={hotel.name?.en || "Hotel Gates"}
            checkIn={booking.check_in_date}
            checkOut={booking.check_out_date}
            roomType={booking.room?.room_type?.name?.en}
            roomNumber={booking.room?.room_number}
            pricePerNight={booking.price_per_night}
            discount={booking.discount}
            totalPrice={booking.total_price}
            paymentMethod={booking.payment_method}
            adults={booking.adults}
            children={booking.children}
            status={booking.status}
            channel={booking.channel}
          />
        </div>
      </div>
      {showEditModal && (
        <EditReservationModal
          booking={booking}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
          saving={actionLoading}
        />
      )}
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-zinc-400">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-zinc-400">{label}</p>

        <p className="mt-1 wrap-break-words text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {value}
        </p>
      </div>
    </div>
  );
}
