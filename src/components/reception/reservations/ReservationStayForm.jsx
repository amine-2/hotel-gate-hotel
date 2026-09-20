import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

import { useHotel } from "../../../auth/HotelContext";
import { getAvailableRooms } from "../../../lib/receptionist/getAvailableRooms";

export default function ReservationStayForm({ form, updateForm }) {
  const { hotelId } = useHotel();

  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [roomError, setRoomError] = useState("");

  useEffect(() => {
    if (!hotelId || !form.check_in_date || !form.check_out_date) {
      setRooms([]);
      return;
    }

    if (form.check_out_date <= form.check_in_date) {
      setRooms([]);
      return;
    }

    async function loadRooms() {
      try {
        setLoadingRooms(true);
        setRoomError("");

        const data = await getAvailableRooms({
          hotelId,
          checkInDate: form.check_in_date,
          checkOutDate: form.check_out_date,
        });

        setRooms(data);
      } catch (error) {
        console.error("Failed to load available rooms:", error);
        setRoomError("Failed to load available rooms.");
        setRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    }

    loadRooms();
  }, [hotelId, form.check_in_date, form.check_out_date]);

  function handleRoomSelect(room) {
    const roomType = room.room_type;

    updateForm({
      room_id: room.id,
      price_per_night:
        roomType?.price_per_night !== null &&
        roomType?.price_per_night !== undefined
          ? roomType.price_per_night
          : "",
    });
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          Stay Information
        </h2>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Select the dates and room for the reservation.
        </p>
      </div>

      <div className="space-y-6 p-6">
        {/* Dates */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Check-in *
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                type="date"
                value={form.check_in_date}
                onChange={(e) =>
                  updateForm({
                    check_in_date: e.target.value,
                    room_id: "",
                    price_per_night: "",
                  })
                }
                required
                className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Check-out *
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                type="date"
                value={form.check_out_date}
                min={form.check_in_date || undefined}
                onChange={(e) =>
                  updateForm({
                    check_out_date: e.target.value,
                    room_id: "",
                    price_per_night: "",
                  })
                }
                required
                className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Room *
          </label>

          {!form.check_in_date || !form.check_out_date ? (
            <div className="rounded-xl border border-dashed border-zinc-300 px-4 py-6 text-center dark:border-zinc-700">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Select check-in and check-out dates to see available rooms.
              </p>
            </div>
          ) : loadingRooms ? (
            <div className="rounded-xl border border-zinc-200 px-4 py-6 text-center dark:border-zinc-700">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Loading available rooms...
              </p>
            </div>
          ) : roomError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              {roomError}
            </div>
          ) : rooms.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 px-4 py-6 text-center dark:border-zinc-700">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                No rooms available
              </p>

              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                There are no available rooms for these dates.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {rooms.map((room) => {
                const selected = form.room_id === room.id;
                const roomType = room.room_type;

                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => handleRoomSelect(room)}
                    className={`w-[30%] rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900 dark:border-zinc-100 dark:bg-zinc-800 dark:ring-zinc-100"
                        : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-500"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                          Room {room.room_number}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          Floor {room.floor}
                        </p>
                      </div>

                      {selected && (
                        <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                          Selected
                        </span>
                      )}
                    </div>

                    <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-700">
                      {roomType ? (
                        <>
                          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {roomType.name?.en || "Room Type"}
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              Capacity: {roomType.capacity ?? "—"}
                            </span>

                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                              {roomType.price_per_night !== null &&
                              roomType.price_per_night !== undefined
                                ? `${Number(
                                    roomType.price_per_night
                                  ).toLocaleString()} DZD / night`
                                : "Price not set"}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            No room type assigned
                          </p>

                          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                            You can set the reservation price below.
                          </p>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Price per Night *
          </label>

          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price_per_night}
              onChange={(e) =>
                updateForm({
                  price_per_night: e.target.value,
                })
              }
              placeholder="Enter price per night"
              required
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-16 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 dark:text-zinc-400">
              DZD
            </span>
          </div>

          {form.room_id && (
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              The price can be changed for this reservation.
            </p>
          )}
        </div>

        {/* Payment + Discount */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Payment Method
            </label>

            <select
              value={form.payment_method}
              onChange={(e) =>
                updateForm({
                  payment_method: e.target.value,
                })
              }
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="other">Other</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Discount
            </label>

            <input
              type="number"
              min="0"
              max="100"
              value={form.discount}
              onChange={(e) =>
                updateForm({
                  discount: Math.max(0, Number(e.target.value)),
                })
              }
              placeholder="0"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Notes
          </label>

          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => updateForm({ notes: e.target.value })}
            placeholder="Additional notes..."
            className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
      </div>
    </section>
  );
}