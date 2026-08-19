import { useEffect, useState } from "react";
import { getHotels } from "../../../../lib/hotels/getHotels";

export default function HotelFilter({ value, onChange }) {
  const [hotels, setHotels] = useState([]);

  const lang = "en";

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    const data = await getHotels();
    setHotels(data || []);
  };

  return (
    <select
      className="input border border-gray-700 rounded p-2 py-1 dark:bg-zinc-800 dark:border-gray-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="all">All Hotels</option>
      {hotels.map((h) => (
        <option key={h.id} value={h.id}>
          {h.name?.[lang] || "No name"}
        </option>
      ))}
    </select>
  );
}