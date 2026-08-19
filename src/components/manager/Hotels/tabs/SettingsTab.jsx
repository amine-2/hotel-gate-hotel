import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import getHotelById from "../../../../lib/hotels/getHotelById";
import BasicInfoForm from "../ui/BasicInfoForm";
import ManagerForm from "../ui/ManagerForm";

export default function HotelSettingsTab() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    async function fetchHotel() {
      const data = await getHotelById(hotelId);
      setHotel(data);
    }

    if (hotelId) fetchHotel();
  }, [hotelId]);

  if (!hotel) {
    return <div className="p-6 text-zinc-500">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <BasicInfoForm hotel={hotel} setHotel={setHotel} />
      <ManagerForm hotel={hotel} setHotel={setHotel} />
    </div>
  );
}