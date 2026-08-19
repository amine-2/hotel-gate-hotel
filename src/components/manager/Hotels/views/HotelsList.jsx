import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHotels } from "../../../../lib/hotels/getHotels";
import HotelsGrid from "../ui/HotelsGrid";

export default function HotelsList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHotels() {
      const data = await getHotels();
      setHotels(data);
      setLoading(false);
    }

    fetchHotels();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-zinc-400">
        Loading hotels...
      </div>
    );
  }

  return (
    <div className="px-14 py-6  dark:bg-zinc-900 text-zinc-700 dark:text-zinc-100">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-16 mt-16 w-full border-b border-zinc-300 pb-4 ">
        <h1 className="text-3xl font-semibold text-zinc-800 dark:text-zinc-100">
          Hotels
        </h1>

      </div>

      {/* Grid */}
      <HotelsGrid hotels={hotels} />

        <button
          onClick={() => navigate("add")}
          className="bg-black text-white  px-4 py-2 rounded-xl hover:bg-white hover:text-black hover:border hover:border-black transition cursor-pointer fixed bottom-6 right-6 dark:bg-orange-500 dark:hover:bg-zinc-900 dark:hover:text-orange-500 dark:hover:border dark:hover:border-orange-500"
        >
          <span className="font-bold">+</span> Add Hotel
        </button>
    </div>
  );
}