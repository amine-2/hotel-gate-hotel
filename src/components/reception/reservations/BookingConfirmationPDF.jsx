import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Check } from "lucide-react";

export default function BookingConfirmationPDF({
  bookingId,
  guestName,
  hotelName,
  checkIn,
  checkOut,
  roomType,
  roomNumber,
  pricePerNight,
  discount,
  totalPrice,
  paymentMethod,
  adults,
  children,
  status,
  channel,
}) {
  const documentRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const bookingUrl = `http://localhost:3000/en/book?success=true&booking_id=${bookingId}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy booking link:", error);
    }
  }

  useEffect(() => {
    const style = document.createElement("style");

    style.id = "booking-print-styles";

    style.innerHTML = `
      @media print {
        @page {
          size: A4;
          margin: 0;
        }

        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }

        body * {
          visibility: hidden !important;
        }

        #booking-print-document,
        #booking-print-document * {
          visibility: visible !important;
        }

        #booking-print-document {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 794px !important;
          height: 1123px !important;
          margin: 0 !important;
          padding: 40px !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          overflow: hidden !important;
        }

        #booking-print-document .print-only-document {
          display: block !important;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  function handlePrint() {
    window.print();
  }

  const discountPercent = Number(discount) || 0;
  const price = Number(pricePerNight) || 0;
  const total = Number(totalPrice) || 0;

  const formattedPaymentMethod =
    paymentMethod
      ?.replace(/_/g, " ")
      ?.replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Other";

  const formattedChannel =
    channel === "walk_in"
      ? "On-site"
      : channel
        ? channel
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase())
        : "Online";

  const formattedStatus =
    status
      ?.replace(/_/g, " ")
      ?.replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Pending";

  return (
    <div className="flex flex-col items-center">
      {/* PRINT BUTTON */}
      <button
        type="button"
        onClick={handlePrint}
        className="mb-6 flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 print:hidden"
      >
        Print Booking
      </button>

      {/* BOOKING DOCUMENT */}
      <div
        ref={documentRef}
        id="booking-print-document"
        className="print-only-document relative w-[794px] min-h-[1123px] bg-white p-10 text-black shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex w-full flex-col items-center text-center">
          <img
            src="./nav-logo-2.svg"
            alt="Hotel Gates"
            className="my-10 h-auto w-[300px]"
          />

          <div className="h-0.5 w-full bg-[#f97316]" />

          <p className="my-5 text-3xl text-[#4a5565]">Booking Confirmation</p>
        </div>

        {/* MAIN INFORMATION */}
        <div className="mt-8 flex justify-between gap-8">
          <div className="flex flex-col gap-2  justify-start items-start text-sm text-[#1f2937]">
            <p>
              <strong>Guest Name:</strong> {guestName || "—"}
            </p>

            <p>
              <strong>Booking ID:</strong> {bookingId || "—"}
            </p>

            <p>
              <strong>Status:</strong> {formattedStatus}
            </p>

            <p>
              <strong>Booking Channel:</strong> {formattedChannel}
            </p>

            <p>
              <strong>Adults:</strong> {adults ?? 1}
            </p>

            <p>
              <strong>Children:</strong> {children ?? 0}
            </p>

            <p>
              <strong>Check-in:</strong> {checkIn || "—"}
            </p>

            <p>
              <strong>Check-out:</strong> {checkOut || "—"}
            </p>

            <p>
              <strong>Room Type:</strong> {roomType || "—"}
            </p>

            <p>
              <strong>Room Number:</strong> {roomNumber || "—"}
            </p>

            <p>
              <strong>Price / Night:</strong> {price.toLocaleString()} DZD
            </p>

            {discountPercent > 0 && (
              <p>
                <strong>Discount:</strong> {discountPercent}%
              </p>
            )}

            <p>
              <strong>Payment Method:</strong> {formattedPaymentMethod}
            </p>

            <p className="pt-1 text-base">
              <strong>Total Price:</strong> {total.toLocaleString()} DZD
            </p>
          </div>

          {/* QR CODE */}
          <div className="flex h-[195px] w-[195px] shrink-0 items-center justify-center rounded-md bg-[#f97316] p-2">
            <QRCodeCanvas
              value={bookingId || ""}
              size={180}
              level="H"
              bgColor="#ffffff"
              fgColor="#1e2939"
              marginSize={2}
              title="Scan to access booking confirmation"
              imageSettings={{
                src: "./logo-blck.svg",
                height: 35,
                width: 35,
                excavate: true,
              }}
            />
          </div>
        </div>

        {/* MESSAGE */}
        <div className="m-8 mt-12">
          <p className="text-[#364153]">
            Thank you for choosing <strong>{ hotelName || "Hotel Gates"}</strong>
            . We look forward to hosting you. If you have any questions, please
            contact our support.
          </p>
        </div>

        {/* QR INSTRUCTIONS */}
        <div className="mt-10 rounded-lg border border-[#e5e7eb] px-5 py-4 text-center">
          <p className="text-sm font-medium text-[#364153]">Booking QR Code</p>

          <p className="mt-1 text-xs text-[#6b7280]">
            Present this document at reception , The QR code is used to quickly
            access this reservation at reception.
          </p>
        </div>

        {/* FOOTER */}
        <footer className="absolute bottom-10 left-10 right-10 text-center text-sm text-[#99a1af]">
          Hotel Gates · Booking Confirmation
        </footer>
      </div>

      <div className="mt-6 w-full max-w-[794px] rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900 print:hidden">
        <p className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Booking Confirmation Link
        </p>

        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1 rounded-lg bg-zinc-100 px-4 py-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <p className="truncate">{bookingUrl}</p>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {copied ? (
              <>
                <Check size={17} />
                Copied
              </>
            ) : (
              <>
                <Copy size={17} />
                Copy
              </>
            )}
          </button>
        </div>

        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Share this link with the guest to access their booking confirmation.
        </p>
      </div>
    </div>
  );
}
