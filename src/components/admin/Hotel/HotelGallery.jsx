export default function HotelGallery({ images = [] }) {
  if (!images.length) {
    return (
      <section className="rounded-xl border bg-white p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Hotel Images</h2>
          <p className="text-sm text-gray-500">
            No images have been added yet.
          </p>
        </div>

        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
          <span className="text-sm text-gray-400">
            No hotel images
          </span>
        </div>
      </section>
    );
  }

  const [mainImage, ...galleryImages] = images;

  return (
    <section className="rounded-xl border bg-white p-6 dark:bg-zinc-800 dark:text-white dark:border-gray-700">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Hotel Images</h2>
        <p className="text-sm text-gray-500">
          The first image is used as the hotel's main image.
        </p>
      </div>

      <div className="space-y-4">
        {/* Main image */}
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={mainImage}
            alt="Hotel main"
            className="h-80 w-full object-cover"
          />

          <span className="absolute left-3 top-3 rounded-md bg-black/60 px-3 py-1 text-xs font-medium text-white">
            Main Image
          </span>
        </div>

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {galleryImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="overflow-hidden rounded-lg"
              >
                <img
                  src={image}
                  alt={`Hotel ${index + 2}`}
                  className="h-32 w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}