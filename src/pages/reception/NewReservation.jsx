

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useHotel } from "../../auth/HotelContext";

import ReservationGuestForm from "../../components/reception/reservations/ReservationGuestForm";
import ReservationStayForm from "../../components/reception/reservations/ReservationStayForm";
import ReservationSummary from "../../components/reception/reservations/ReservationSummary";

import { createReservation } from "../../lib/receptionist/createReservation";

export default function NewReservation() {
  const navigate = useNavigate();
  const { hotelId } = useHotel();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    adults: 1,
    children: 0,
    check_in_date: "",
    check_out_date: "",
    room_id: "",
    price_per_night: "",
    payment_method: "other",
    discount: 0,
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateForm(updates) {
    setForm((current) => ({
      ...current,
      ...updates,
    }));
  }

  function handleBack() {
    navigate("/dashboard/reception/reservations");
  }

  async function handleCreateReservation() {
    try {
      setError("");

      if (!hotelId) {
        setError("Hotel information is not available.");
        return;
      }

      if (!form.name.trim()) {
        setError("Please enter the guest name.");
        return;
      }

      if (!form.check_in_date || !form.check_out_date) {
        setError("Please select the check-in and check-out dates.");
        return;
      }

      if (form.check_out_date <= form.check_in_date) {
        setError("Check-out date must be after check-in date.");
        return;
      }

      if (!form.room_id) {
        setError("Please select a room.");
        return;
      }

      if (
        form.price_per_night === "" ||
        Number(form.price_per_night) < 0
      ) {
        setError("Please enter a valid price per night.");
        return;
      }

      setSaving(true);

      const reservation = await createReservation({
        hotelId,

        name: form.name,
        phone: form.phone,
        email: form.email,

        adults: form.adults,
        children: form.children,

        check_in_date: form.check_in_date,
        check_out_date: form.check_out_date,

        room_id: form.room_id,
        price_per_night: form.price_per_night,

        discount: form.discount,

        payment_method: form.payment_method,
        notes: form.notes,
      });

      navigate(
        `/dashboard/reception/reservations/${reservation.id}`
      );
    } catch (err) {
      console.error("Failed to create reservation:", err);

      setError(
        err?.message || "Failed to create reservation"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col p-8 pt-16 pl-16">
      <div className="mx-auto w-[95%]">
        <button
          onClick={handleBack}
          disabled={saving}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft size={18} />
          Back to Reservations
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200">
            New Reservation
          </h1>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Create an on-site reservation
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <ReservationGuestForm
              form={form}
              updateForm={updateForm}
            />

            <ReservationStayForm
              form={form}
              updateForm={updateForm}
            />
          </div>

          <div>
            <ReservationSummary
              form={form}
              onCreate={handleCreateReservation}
              saving={saving}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


