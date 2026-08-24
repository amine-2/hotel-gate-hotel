export default function HotelHeader({ hotel }) {
  const name = hotel?.name ;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {name.en}
        </h1>

        <p className="mt-1  text-gray-500 dark:text-gray-400">
          Hotel information
        </p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          hotel?.status === "published"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
        }`}
      >
        {hotel?.status || "draft"}
      </span>
    </div>
  );
}