import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useHotel } from "../../auth/HotelContext";

import HotelHeader from "../../components/manager/Hotel/HotelHeader";
import HotelInfo from "../../components/manager/Hotel/HotelInfo";
import HotelImages from "../../components/manager/Hotel/HotelImages";

export default function HotelPage() {
  const { hotelId } = useHotel();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hotelId) return;

    const loadHotel = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("hotel_accounts")
        .select("*")
        .eq("id", hotelId)
        .single();

      if (error) {
        console.error("Failed to load hotel:", error);
        setError("Failed to load hotel information.");
      } else {
        setHotel(data);
      }

      setLoading(false);
    };

    loadHotel();
  }, [hotelId]);

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center ">
        <p className="text-sm text-gray-500">Loading hotel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/10">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!hotel) return null;

  return (
    <div className="flex flex-col gap-10  p-16">
      <HotelHeader hotel={hotel} />
      <HotelInfo hotel={hotel} />
      <HotelImages hotel={hotel} />
    </div>
  );
}
