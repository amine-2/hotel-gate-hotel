import HotelCard from "./HotelCard";

export default function HotelsGrid({ hotels }) {
  if (!hotels.length) {
    return (
      <div className="text-zinc-500">
        No hotels yet.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}