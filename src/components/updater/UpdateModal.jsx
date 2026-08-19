export default function UpdateModal({
  update,
  downloading,
  downloaded,
  progress,
  error,
  onDownload,
  onInstall,
  onClose,
}) {
  if (!update && !error) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-105 rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
        {/* =================================================
            ERROR
        ================================================= */}

        {error && !update && (
          <>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
              !
            </div>

            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Update error
            </h2>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {error}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
          </>
        )}

        {/* =================================================
            UPDATE AVAILABLE
        ================================================= */}

        {update && !downloading && !downloaded && (
          <>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              ↑
            </div>

            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Update available
            </h2>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              A new version of Hotel Gates Global is
              available.
            </p>

            {update.version && (
              <div className="mt-4 rounded-lg bg-zinc-50 px-4 py-3 dark:bg-zinc-800">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  New version
                </div>

                <div className="mt-1 font-semibold text-zinc-900 dark:text-white">
                  {update.version}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Later
              </button>

              <button
                type="button"
                onClick={onDownload}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Download update
              </button>
            </div>
          </>
        )}

        {/* =================================================
            DOWNLOADING
        ================================================= */}

        {update && downloading && (
          <>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Downloading update
            </h2>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Please wait while the update is downloaded.
            </p>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Downloading...</span>
                <span>{Math.round(progress)}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className="h-full rounded-full bg-black transition-all duration-300 dark:bg-white"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, progress)
                    )}%`,
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* =================================================
            DOWNLOADED
        ================================================= */}

        {update && downloaded && !downloading && (
          <>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600">
              ✓
            </div>

            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Update ready
            </h2>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Version {update.version} has been
              downloaded and is ready to install.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Later
              </button>

              <button
                type="button"
                onClick={onInstall}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Restart & Update
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}