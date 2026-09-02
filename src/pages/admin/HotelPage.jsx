import { useEffect, useState } from "react";
import { useHotel } from "../../auth/HotelContext";
import { getHotelInfo } from "../../lib/hotel/getHotelInfo";
import HotelPreview from "../../components/admin/Hotel/HotelPreview";
import EditHotel from "../../components/admin/Hotel/EditHotel";

export default function HotelPage() {
  const { hotelId } = useHotel();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  async function loadHotel() {
    if (!hotelId) return;

    setLoading(true);
    setError(null);

    const { data, error } = await getHotelInfo(hotelId);

    if (error) {
      console.error("Failed to load hotel:", error);
      setError(error);
    } else {
      setHotel(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadHotel();
  }, [hotelId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center  p-16">
        Loading hotel...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-16 text-red-500">
        Failed to load hotel information.
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="p-16">
        Hotel information not found.
      </div>
    );
  }
if (editing) {
  return (
    <div className="p-16">
      <EditHotel
        hotel={hotel}
        onCancel={() => setEditing(false)}
        onSaved={(updatedHotel) => {
          setHotel(updatedHotel);
          setEditing(false);
        }}
        onHotelUpdated={(updatedHotel) => {
          setHotel(updatedHotel);
        }}
      />
    </div>
  );
}

  return (
    <div className="p-16">
    <HotelPreview
      hotel={hotel}
      onEdit={() => setEditing(true)}
    />
    </div>
  );
}