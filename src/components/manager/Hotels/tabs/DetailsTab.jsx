import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getHotelDetailsById from "../../../../lib/hotels/getHotelDetailsById";
import avatarPlaceholder from "../../../../assets/avatar-placeholder.png";

export default function DetailsTab() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    async function fetchHotel() {
      const data = await getHotelDetailsById(hotelId);
      setHotel(data);
    }

    fetchHotel();
  }, [hotelId]);

  if (!hotel) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  return (
    <div className="space-y-6 w-full flex flex-col justify-center items-center">
      {/* Image */}
      {hotel.images?.[0] && (
        <img
          src={hotel.images[0]}
          alt="hotel"
          className="w-full h-48 object-cover rounded-xl"
        />
      )}

      <div className="w-full flex flex-col md:flex-row gap-6">
      <div className="w-2/3 flex flex-col gap-3 justify-center items-start p-6 rounded-xl border border-zinc-300  dark:border-zinc-600">
        <p className="text-lg text-zinc-800 font-bold dark:text-zinc-300">Hotel Details</p>
        <p className="text-md text-zinc-800 dark:text-zinc-300"><strong>Hotel Name:</strong> {hotel.name?.en || "—"}</p>
        <p className="text-md text-zinc-800 dark:text-zinc-300"> <strong>City:</strong> {hotel.location?.city?.en || "—"}</p>
        <p className="text-md text-zinc-800 text-left dark:text-zinc-300"><strong>Description:</strong> {hotel.description?.en || "No description"}</p>
        <p className="text-md text-zinc-800 text-left dark:text-zinc-300"><strong>Rooms:</strong> {hotel.rooms_number || "—"}</p>
        <p className={`text-md text-zinc-800 dark:text-zinc-300`}><strong>Status:</strong> <span
          className={`px-2 py-1 rounded  ${
            hotel.status === "published"
            ? "bg-green-100 text-green-700"
            : "bg-zinc-200 text-zinc-600"
            }`}
        >
          {hotel.status === "published" ? "Published" : "Draft"}
        </span></p>
        
      </div>

      

      {/* Manager */}
      <div className="w-2/5 flex flex-col gap-3 justify-around items-center p-6 rounded-xl border border-zinc-300  dark:border-zinc-600">
            <p className="text-lg text-zinc-800 font-bold dark:text-zinc-300">Manager</p>
            <img
              src={hotel.manager_avatar || avatarPlaceholder}
              alt="Manager Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
        <p className="text-zinc-700 dark:text-zinc-300">{hotel.manager_name || "Not assigned"}</p>
      </div>

        </div>
    </div>
  );
}
