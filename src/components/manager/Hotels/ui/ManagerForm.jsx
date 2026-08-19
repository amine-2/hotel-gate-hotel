import { useEffect, useState } from "react";
import { getManagers } from "../../../../lib/users/getManagers";
import { updateHotel } from "../../../../lib/hotels/updateHotel";
import { supabase } from "../../../../lib/supabase";

export default function ManagerForm({ hotel, setHotel }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [managers, setManagers] = useState([]);
  const [selected, setSelected] = useState(hotel.manager_id || "");

  useEffect(() => {
    async function fetchManagers() {
      const data = await getManagers();
      setManagers(data);
    }

    fetchManagers();
  }, []);

  const handleSave = async () => {
    if (!selected) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 🔹 1. Remove old manager (if exists)
      if (hotel.manager_id && hotel.manager_id !== selected) {
        await supabase
          .from("profiles")
          .update({ hotel_id: null })
          .eq("id", hotel.manager_id);
      }

      // 🔹 2. Assign new manager to hotel
      const updated = await updateHotel(hotel.id, {
        manager_id: selected,
      });

      if (!updated) throw new Error("Failed to update hotel");

      // 🔹 3. Assign hotel to new manager profile
      await supabase
        .from("profiles")
        .update({ hotel_id: hotel.id })
        .eq("id", selected);

      // 🔹 4. Update UI
      setHotel(updated);
      setSuccess(true);

      // auto hide success
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to update manager");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-500 space-y-4 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300">
      <h3 className="text-lg font-semibold">Manager</h3>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full border border-gray-500 p-2 rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
      >
        <option value="">Select Manager</option>
        {managers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.full_name}
          </option>
        ))}
      </select>

      <button
        onClick={handleSave}
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50 
        hover:bg-gray-800  transition cursor-pointer disabled:cursor-not-allowed dark:bg-orange-500 dark:hover:bg-orange-600"
      >
        {loading ? "Saving..." : "Save"}
      </button>

      {success && <div className="text-green-500">Updated successfully!</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
