export default function HotelImages({ hotel }) {
  const images = hotel?.images || [];

  if (!images.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Images
        </h2>

        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No images available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Images
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <img
              src={image}
              alt={`Hotel ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}