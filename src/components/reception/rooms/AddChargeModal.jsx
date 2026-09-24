import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { addStayCharge } from "../../../lib/receptionist/stays/addStayCharge";

export default function AddChargeModal({
  isOpen,
  onClose,
  hotelId,
  stay,
  booking,
  onSuccess,
}) {
  const [name, setName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setUnitPrice("");
      setQuantity("1");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const price = Number(unitPrice) || 0;
  const qty = Number(quantity) || 0;
  const lineTotal = price * qty;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Charge name is required.");
      return;
    }

    if (!unitPrice || Number(unitPrice) <= 0) {
      setError("Unit price must be greater than 0.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    if (!stay?.id || !booking?.id) {
      setError("Stay information is missing.");
      return;
    }

    setSaving(true);

    const { data, error: addError } = await addStayCharge({
      hotelId,
      stayId: stay.id,
      bookingId: booking.id,
      roomId: stay.room_id,
      item: {
        name,
        unit_price: Number(unitPrice),
        quantity: Number(quantity),
      },
    });

    setSaving(false);

    if (addError) {
      setError(addError.message || "Failed to add charge.");
      return;
    }

    onSuccess?.(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add Charge
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add a charge to this stay.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Charge name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Charge
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Breakfast, Laundry, Minibar"
              disabled={saving}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
          </div>

          {/* Price + quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Unit Price
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="0.00"
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Line Total
              </span>

              <span className="font-semibold text-gray-900 dark:text-white">
                {lineTotal.toLocaleString()} DZD
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              {saving ? "Adding..." : "Add Charge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}