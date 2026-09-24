import { useEffect, useState } from "react";
import { ArrowLeft, History } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useHotel } from "../../auth/HotelContext";
import { getRoomDetails } from "../../lib/receptionist/rooms/getRoomDetails";
import CurrentRoomStay from "../../components/reception/rooms/CurrentRoomStay";
import AddChargeModal from "../../components/reception/rooms/AddChargeModal";
import { getStayCharges } from "../../lib/receptionist/stays/getStayCharges";
import { deleteStayChargeItem } from "../../lib/receptionist/stays/deleteStayChargeItem";

export default function RoomDetails() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { hotelId } = useHotel();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addChargeOpen, setAddChargeOpen] = useState(false);
  const [charges, setCharges] = useState(null);
  const [chargesLoading, setChargesLoading] = useState(false);
  const [deletingChargeId, setDeletingChargeId] = useState(null);

  const loadCharges = async (stayId) => {
    if (!stayId) {
      setCharges(null);
      return;
    }

    setChargesLoading(true);

    const { data, error } = await getStayCharges(stayId);

    if (error) {
      console.error("RoomDetails - charges:", error);
      setCharges(null);
    } else {
      setCharges(data);
    }

    setChargesLoading(false);
  };

  useEffect(() => {
    if (room?.currentStay?.id) {
      loadCharges(room.currentStay.id);
    } else {
      setCharges(null);
    }
  }, [room?.currentStay?.id]);

  const loadRoom = async () => {
    if (!hotelId || !roomId) return;

    setLoading(true);
    setError(null);

    const { data, error } = await getRoomDetails(hotelId, roomId);

    if (error) {
      console.error("RoomDetails:", error);
      setError(error.message || "Failed to load room.");
      setLoading(false);
      return;
    }

    setRoom(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRoom();
  }, [hotelId, roomId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Loading room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (!room) {
    return (
      <div className="py-20 text-center text-gray-500 dark:text-gray-400">
        Room not found.
      </div>
    );
  }

  const statusLabel = {
    occupied: "Occupied",
    reserved: "Reserved",
    available: "Available",
    inactive: "Inactive",
  };

  const statusStyles = {
    occupied:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    reserved:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    available:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    inactive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const handleCreateReservation = () => {
    navigate(`/dashboard/reception/reservations/new?roomId=${room.id}`);
  };

  const handleStayHistory = () => {
    navigate(`/dashboard/reception/stay-history?roomId=${room.id}`);
  };

  const handleTransfer = () => {
    // TransferRoomModal will be connected here.
  };

  const handleAddCharge = () => {
    setAddChargeOpen(true);
  };

  const handleCheckout = () => {
    // CheckoutModal will be connected here.
  };

  const handleChargeSuccess = (updatedCharges) => {
    setCharges(updatedCharges);
  };

  const handleDeleteCharge = async (itemId) => {
    if (!charges?.id || charges.is_finalized) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this charge?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingChargeId(itemId);

    const { data, error } = await deleteStayChargeItem({
      hotelId,
      stayChargeId: charges.id,
      itemId,
    });

    setDeletingChargeId(null);

    if (error) {
      console.error("RoomDetails - delete charge:", error);

      window.alert(error.message || "Failed to delete charge.");
      return;
    }

    setCharges(data);
  };

  return (
    <div className="p-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/reception/rooms")}
            className="mb-3 flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Rooms
          </button>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Room {room.room_number}
          </h1>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {room.room_types?.name?.en || "No room type"} · Floor {room.floor}
          </p>
        </div>

        <button
          type="button"
          onClick={handleStayHistory}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <History size={17} />
          Stay History
        </button>
      </div>

      {/* Room Information */}
      <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Room Information
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Room Number
            </p>

            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {room.room_number}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Floor</p>

            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {room.floor}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Room Type
            </p>

            <p className="mt-1 font-medium text-gray-900 dark:text-white">
              {room.room_types?.name?.en || "No room type"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>

            <span
              className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                statusStyles[room.status]
              }`}
            >
              {statusLabel[room.status] || room.status}
            </span>
          </div>
        </div>
      </section>

      {/* Current Stay */}
      {room.currentStay && room.currentBooking ? (
        <CurrentRoomStay
          stay={room.currentStay}
          booking={room.currentBooking}
          onTransfer={handleTransfer}
          onAddCharge={handleAddCharge}
          onCheckout={handleCheckout}
        />
      ) : (
        /* Available Room */
        <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  No Active Stay
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This room currently has no active reservation or checked-in
                  guest.
                </p>
              </div>

              {room.status === "available" && (
                <button
                  type="button"
                  onClick={handleCreateReservation}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  Create Reservation
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {room.currentStay && room.currentBooking && (
        <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Charges
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Charges associated with this stay.
                </p>
              </div>

              {!charges?.is_finalized && (
                <button
                  type="button"
                  onClick={() => setAddChargeOpen(true)}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  Add Charge
                </button>
              )}
            </div>
          </div>

          <div className="p-5">
            {chargesLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading charges...
              </p>
            ) : !charges || !charges.items?.length ? (
              <div className="py-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No charges have been added to this stay.
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {charges.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.quantity} ×{" "}
                          {Number(item.unit_price).toLocaleString()} DZD
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-4">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {Number(item.total).toLocaleString()} DZD
                        </p>

                        {!charges.is_finalized && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCharge(item.id)}
                            disabled={deletingChargeId === item.id}
                            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                          >
                            {deletingChargeId === item.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Subtotal
                    </span>

                    <span className="font-medium text-gray-900 dark:text-white">
                      {Number(charges.subtotal).toLocaleString()} DZD
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Discount
                    </span>

                    <span className="font-medium text-gray-900 dark:text-white">
                      {Number(charges.discount).toLocaleString()} DZD
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>

                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {Number(charges.total).toLocaleString()} DZD
                    </span>
                  </div>
                </div>

                {charges.is_finalized && (
                  <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:bg-gray-900/50 dark:text-gray-400">
                    This bill has been finalized and can no longer be modified.
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      <AddChargeModal
        isOpen={addChargeOpen}
        onClose={() => setAddChargeOpen(false)}
        hotelId={hotelId}
        stay={room.currentStay}
        booking={room.currentBooking}
        onSuccess={handleChargeSuccess}
      />
    </div>
  );
}
