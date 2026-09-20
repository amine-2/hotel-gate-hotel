import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useHotel } from "../../auth/HotelContext";

import ReservationSearch from "../../components/reception/reservations/ReservationSearch";
import ReservationTabs from "../../components/reception/reservations/ReservationTabs";
import BookingTable from "../../components/reception/reservations/BookingTable";
import QRScannerModal from "../../components/reception/reservations/QRScannerModal";

import { getReservations } from "../../lib/receptionist/getReservations";

export default function Reservations() {
  const navigate = useNavigate();
  const { hotelId } = useHotel();

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);

  useEffect(() => {
    if (!hotelId) return;

    async function loadReservations() {
      try {
        setLoading(true);
        setError("");

        const data = await getReservations({
          hotelId,
          status: activeTab,
          search,
        });

        setBookings(data);
      } catch (err) {
        console.error("Failed to load reservations:", err);
        setError("Failed to load reservations");
      } finally {
        setLoading(false);
      }
    }

    loadReservations();
  }, [hotelId, activeTab, search]);

  function handleBookingClick(booking) {
    navigate(`/dashboard/reception/reservations/${booking.id}`);
  }

  function handleQRScan(bookingId) {
    setShowQRScanner(false);

    navigate(`/dashboard/reception/reservations/${bookingId}`);
  }

  return (
    <div className="flex min-h-full flex-col p-8 pt-16 pl-16">
      <div className="mx-auto w-[95%]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200">
              Reservations
            </h1>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Manage hotel reservations
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/dashboard/reception/reservations/new")
            }
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus size={18} />
            New Reservation
          </button>
        </div>

        <ReservationSearch
          search={search}
          setSearch={setSearch}
          onScanQR={() => setShowQRScanner(true)}
         
        />

        <ReservationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
            Loading reservations...
          </div>
        ) : (
          <BookingTable
            bookings={bookings}
            onBookingClick={handleBookingClick}
          />
        )}
      </div>

      {showQRScanner && (
        <QRScannerModal
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
}