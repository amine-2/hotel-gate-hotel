import HotelInfoSection from "./HotelInfoSection";
import HotelGallery from "./HotelGallery";

export default function HotelPreview({ hotel, onEdit }) {
  const images = hotel.images || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Hotel
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage your hotel's information.
          </p>
        </div>

        <button
          onClick={onEdit}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-orange-500"
        >
          Edit Hotel
        </button>
      </div>

      <HotelGallery images={images} />

      <HotelInfoSection hotel={hotel} />
    </div>
  );
}