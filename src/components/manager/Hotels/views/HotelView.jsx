import { useEffect, useState } from "react";
import { useParams, Outlet } from "react-router-dom";
import getHotelById from "../../../../lib/hotels/getHotelById";
import HotelTabs from "../ui/HotelTabs";

export default function HotelView() {
  const { hotelId } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHotel() {
      const data  = await getHotelById(hotelId);

      setHotel(data);
      setLoading(false);
    }

    fetchHotel();
  }, [hotelId]);

  if (loading) {
    return <div className=" px-14 py-6 text-zinc-500">Loading...</div>;
  }

  return (
    <div className="px-14 py-6">
      {/* Header */}
      <div className="mb-6 mt-6 w-fit">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-300">
          {hotel?.name?.en}
        </h1>
        <p className="text-zinc-400 text-sm text-left">
          {hotel?.location?.city?.en}
        </p>
      </div>

      {/* Tabs */}
      <HotelTabs hotelId={hotelId} />

      {/* Tab Content */}
      <Outlet />
    </div>
  );
}