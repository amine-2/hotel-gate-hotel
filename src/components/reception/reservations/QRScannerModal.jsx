
import { useEffect, useRef, useState } from "react";
import { X, Camera, AlertCircle } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScannerModal({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const scannerId = "reservation-qr-reader";
    const scanner = new Html5Qrcode(scannerId);

    scannerRef.current = scanner;

    async function startScanner() {
      try {
        setStarting(true);
        setError("");

        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
          throw new Error("No camera was found.");
        }

        // Prefer the back camera when available.
        const backCamera =
          cameras.find((camera) =>
            camera.label?.toLowerCase().includes("back")
          ) || cameras[0];

        await scanner.start(
          backCamera.id,
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },
          async (decodedText) => {
            const bookingId = decodedText.trim();

            if (!bookingId) return;

            try {
              await scanner.stop();
            } catch (stopError) {
              console.error("Failed to stop QR scanner:", stopError);
            }

            onScan(bookingId);
          },
          () => {
            // Ignore normal frame-by-frame scan failures.
          }
        );

        setStarting(false);
      } catch (err) {
        console.error("Failed to start QR scanner:", err);

        setStarting(false);
        setError(
          err?.message ||
            "Unable to access the camera. Please check camera permissions."
        );
      }
    }

    startScanner();

    return () => {
      async function cleanup() {
        try {
          if (scannerRef.current?.isScanning) {
            await scannerRef.current.stop();
          }

          if (scannerRef.current) {
            scannerRef.current.clear();
          }
        } catch (err) {
          console.error("Failed to clean up QR scanner:", err);
        }
      }

      cleanup();
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5 dark:border-zinc-700">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Scan Booking QR Code
            </h2>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Point the camera at the booking QR code
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scanner */}
        <div className="p-6">
          <div className="relative overflow-hidden rounded-2xl bg-black">
            <div
              id="reservation-qr-reader"
              className="w-full"
            />

            {starting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
                <Camera size={32} className="mb-3" />

                <p className="text-sm">
                  Starting camera...
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-medium">
                  Camera unavailable
                </p>

                <p className="mt-1">
                  {error}
                </p>
              </div>
            </div>
          )}

          {!error && (
            <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Make sure the QR code is clearly visible inside the frame.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

i