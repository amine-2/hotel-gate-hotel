import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BedDouble, Loader2 } from "lucide-react";

import { getAvailableTransferRooms } from "../../../lib/receptionist/rooms/getAvailableTransferRooms";

export default function TransferRoomModal({
  open,
  onClose,
  hotelId,
  stay,
  booking,
  currentRoom,
  onTransfer,
  loading = false,
}) {
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState(null);

  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [reason, setReason] = useState("");

  // Difference automatically calculated from room rates.
  const [differenceAmount, setDifferenceAmount] = useState("0");

  useEffect(() => {
    if (!open || !hotelId || !stay?.id) {
      return;
    }

    let cancelled = false;

    const loadRooms = async () => {
      setRoomsLoading(true);
      setRoomsError(null);
      setSelectedRoomId("");
      setDifferenceAmount("0");

      const { data, error } = await getAvailableTransferRooms({
        hotelId,
        stayId: stay.id,
      });

      if (cancelled) return;

      setRoomsLoading(false);

      if (error) {
        console.error(
          "TransferRoomModal - get available rooms:",
          error,
        );

        setRoomsError(
          error.message || "Failed to load available rooms.",
        );

        return;
      }

      setRooms(data || []);
    };

    loadRooms();

    return () => {
      cancelled = true;
    };
  }, [open, hotelId, stay?.id]);

  useEffect(() => {
    if (!open) {
      setRooms([]);
      setSelectedRoomId("");
      setReason("");
      setDifferenceAmount("0");
      setRoomsError(null);
    }
  }, [open]);

  const selectedRoom = useMemo(
    () =>
      rooms.find((room) => room.id === selectedRoomId) || null,
    [rooms, selectedRoomId],
  );

  const currentRate = Number(
    currentRoom?.room_types?.price_per_night ??
      currentRoom?.room_type?.price_per_night ??
      0,
  );

  const newRate = Number(
    selectedRoom?.room_types?.price_per_night ??
      selectedRoom?.room_type?.price_per_night ??
      0,
  );

  const rateDifference = newRate - currentRate;

  const remainingNights = useMemo(() => {
    if (!booking?.check_out_date) return 0;

    const today = new Date();

    const todayDate = new Date(
      Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      ),
    );

    const checkoutParts = String(booking.check_out_date)
      .slice(0, 10)
      .split("-")
      .map(Number);

    if (checkoutParts.length !== 3) return 0;

    const checkoutDate = new Date(
      Date.UTC(
        checkoutParts[0],
        checkoutParts[1] - 1,
        checkoutParts[2],
      ),
    );

    const difference =
      (checkoutDate.getTime() - todayDate.getTime()) /
      (1000 * 60 * 60 * 24);

    return Math.max(0, Math.ceil(difference));
  }, [booking?.check_out_date]);

  const calculatedDifference = Math.max(
    0,
    rateDifference * remainingNights,
  );

  const numericDifference = Math.max(
    0,
    Number(differenceAmount) || 0,
  );

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-DZ", {
      style: "currency",
      currency: "DZD",
      maximumFractionDigits: 2,
    }).format(amount);

  const handleRoomChange = (event) => {
    const roomId = event.target.value;

    setSelectedRoomId(roomId);

    const room = rooms.find((item) => item.id === roomId);

    if (!room) {
      setDifferenceAmount("0");
      return;
    }

    const roomRate = Number(
      room.room_types?.price_per_night ??
        room.room_type?.price_per_night ??
        0,
    );

    const calculatedAmount = Math.max(
      0,
      (roomRate - currentRate) * remainingNights,
    );

    setDifferenceAmount(String(calculatedAmount));
  };

  const handleDifferenceChange = (event) => {
    const value = event.target.value;

    if (value === "") {
      setDifferenceAmount("");
      return;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return;
    }

    setDifferenceAmount(String(Math.max(0, numericValue)));
  };

  const handleRemoveDifference = () => {
    setDifferenceAmount("0");
  };

  const handleSubmit = async () => {
    if (!selectedRoomId || loading) {
      return;
    }

    await onTransfer({
      toRoomId: selectedRoomId,
      differenceAmount: numericDifference,
      reason: reason.trim() || null,
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 min-h-full flex items-center justify-center bg-black/70 p-4"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-700">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Transfer Room
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Move {booking?.name || "this guest"} to another
                room.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Close
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5">
          {/* Current room */}
          <div>
            <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Current room
            </p>

            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-700">
                <BedDouble
                  size={20}
                  className="text-zinc-600 dark:text-zinc-300"
                />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-zinc-900 dark:text-white">
                  Room {currentRoom?.room_number || "-"}
                </p>

                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {currentRoom?.room_types?.name?.en ||
                    currentRoom?.room_type?.name?.en ||
                    "Room"}
                </p>
              </div>

              <div className="ml-auto text-right">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Nightly rate
                </p>

                <p className="font-medium text-zinc-900 dark:text-white">
                  {formatAmount(currentRate)}
                </p>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <ArrowRight
                size={18}
                className="text-zinc-500 dark:text-zinc-400"
              />
            </div>
          </div>

          {/* Destination room */}
          <div>
            <label
              htmlFor="transfer-room"
              className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Destination room
            </label>

            {roomsLoading ? (
              <div className="flex items-center justify-center rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
                <Loader2
                  size={20}
                  className="animate-spin text-zinc-500"
                />

                <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Loading available rooms...
                </span>
              </div>
            ) : roomsError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                {roomsError}
              </div>
            ) : rooms.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                No available rooms for transfer.
              </div>
            ) : (
              <select
                id="transfer-room"
                value={selectedRoomId}
                onChange={handleRoomChange}
                disabled={loading}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-400 dark:focus:ring-zinc-700"
              >
                <option value="">
                  Select a room
                </option>

                {rooms.map((room) => {
                  const roomName =
                    room.room_types?.name?.en ||
                    room.room_type?.name?.en ||
                    "Room";

                  const price = Number(
                    room.room_types?.price_per_night ??
                      room.room_type?.price_per_night ??
                      0,
                  );

                  return (
                    <option
                      key={room.id}
                      value={room.id}
                    >
                      Room {room.room_number} · Floor{" "}
                      {room.floor} · {roomName} ·{" "}
                      {formatAmount(price)}/night
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {/* Difference */}
          {selectedRoom && (
            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  New nightly rate
                </span>

                <span className="font-medium text-zinc-900 dark:text-white">
                  {formatAmount(newRate)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Remaining nights
                </span>

                <span className="font-medium text-zinc-900 dark:text-white">
                  {remainingNights}
                </span>
              </div>

              <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Transfer difference
                    </p>

                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Automatically calculated:{" "}
                      {formatAmount(calculatedDifference)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveDifference}
                    disabled={
                      loading || numericDifference === 0
                    }
                    className="text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>

                <div className="relative mt-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={differenceAmount}
                    onChange={handleDifferenceChange}
                    disabled={loading}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-3 pr-16 text-right text-lg font-semibold text-zinc-900 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-400 dark:focus:ring-zinc-700"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500 dark:text-zinc-400">
                    DZD
                  </span>
                </div>

                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  The receptionist can adjust this amount before
                  completing the transfer.
                </p>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label
              htmlFor="transfer-reason"
              className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Reason
            </label>

            <textarea
              id="transfer-reason"
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              disabled={loading}
              rows={3}
              placeholder="Optional reason for the room transfer"
              className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-3 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-400 dark:focus:ring-zinc-700"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-zinc-200 px-5 py-4 dark:border-zinc-700">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !selectedRoomId ||
              loading ||
              roomsLoading
            }
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Transferring...
              </span>
            ) : (
              "Transfer Room"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}