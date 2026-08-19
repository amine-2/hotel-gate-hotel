import { useState } from "react";
import { updateHotel } from "../../../../lib/hotels/updateHotel";

export default function BasicInfoForm({ hotel, setHotel }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState(hotel.name?.en || "");
  const [description, setDescription] = useState(hotel.description?.en || "");
  const [status, setStatus] = useState(hotel.status || "published");
  const [city, setCity] = useState(hotel.location?.city?.en || "");

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await updateHotel(hotel.id, {
        name: { ...hotel.name, en: name },
        description: { ...hotel.description, en: description },
        status,
        location: {
          ...hotel.location,
          city: { ...hotel.location?.city, en: city },
        },
      });

      if (!updated) throw new Error("Update failed");

      setHotel(updated);
      setSuccess(true);

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-500 space-y-4 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300">
      <h3 className="text-lg font-semibold">Basic Info</h3>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Hotel Name"
        className="w-full border border-gray-500 p-2 rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full border border-gray-500 p-2 rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
      />

      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
        className="w-full border border-gray-500 p-2 rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border border-gray-500 p-2 rounded dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
      >
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>

      <button
        onClick={handleSave}
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50 hover:bg-gray-800  
        transition cursor-pointer disabled:cursor-not-allowed dark:bg-orange-500 dark:hover:bg-orange-600"
      >
        {loading ? "Saving..." : "Save"}
      </button>

      {success && <div className="text-green-500">Updated successfully!</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
