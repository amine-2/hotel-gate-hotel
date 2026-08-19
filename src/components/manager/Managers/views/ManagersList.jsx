import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getManagers } from "../../../../lib/users/getManagers";
import { getHotels } from "../../../../lib/hotels/getHotels";

import ManagerCard from "../ui/ManagerCard";

export default function ManagersList() {
  const [managers, setManagers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const [mgrs, hts] = await Promise.all([
      getManagers(),
      getHotels(),
    ]);

    setManagers(mgrs || []);
    setHotels(hts || []);

    setLoading(false);
  };

  const getHotelById = (hotelId) => {
    return hotels.find((h) => h.id === hotelId)?.name;
  };

  const getLangValue = (field, lang = "en") => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[lang] || field.en || field.fr || field.ar || "";
  };

  return (
    <div className=" px-14 py-6">

      {/* HEADER */}
      <div  className=" flex justify-between items-center mb-6 mt-6 ">
        <h1 className="text-2xl font-semibold ">Managers</h1>

        <button
          onClick={() => navigate("add")}
          className="bg-zinc-900 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg cursor-pointer transition dark:bg-orange-500 dark:hover:bg-orange-600"
        >
          + Add Manager
        </button>
      </div>

      
      {loading && (
        <p className="text-zinc-400">Loading managers...</p>
      )}

     
      {!loading && managers.length === 0 && (
        <p className="text-zinc-400">No managers found.</p>
      )}

      
      {!loading && managers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {managers.map((manager) => (
            <div
              key={manager.id}
              onClick={() => navigate(manager.id)}
              className="cursor-pointer"
            >
              <ManagerCard
                manager={manager}
                hotelName={getLangValue(
                  getHotelById(manager.hotel_id),
                  "en"
                )}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}