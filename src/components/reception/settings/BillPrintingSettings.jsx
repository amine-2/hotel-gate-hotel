import { useEffect, useState } from "react";
import { Printer, RefreshCw } from "lucide-react";

import { getBillPrintSettings } from "../../../lib/receptionist/settings/getBillPrintSettings";
import { updateBillPrintSettings } from "../../../lib/receptionist/settings/updateBillPrintSettings";
import { getBillPrinters } from "../../../lib/receptionist/settings/getBillPrinters";

export default function BillPrintingSettings({ hotelId }) {
  const [printingMethod, setPrintingMethod] = useState("windows");
  const [printerName, setPrinterName] = useState("");
  const [paperSize, setPaperSize] = useState("80mm");

  const [printers, setPrinters] = useState([]);

  const [loading, setLoading] = useState(true);
  const [printersLoading, setPrintersLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPrinters = async () => {
    setPrintersLoading(true);
    setError("");

    const { data, error: printersError } =
      await getBillPrinters();

    if (printersError) {
      console.error(
        "BillPrintingSettings - printers:",
        printersError
      );

      setError(
        printersError.message ||
          "Failed to detect installed printers."
      );

      setPrinters([]);
      setPrintersLoading(false);
      return;
    }

    setPrinters(data);
    setPrintersLoading(false);
  };

  useEffect(() => {
    if (!hotelId) return;

    const loadSettings = async () => {
      setLoading(true);
      setError("");

      const [
        { data: settings, error: settingsError },
        { data: detectedPrinters, error: printersError },
      ] = await Promise.all([
        getBillPrintSettings(hotelId),
        getBillPrinters(),
      ]);

      if (settingsError) {
        setError(
          settingsError.message ||
            "Failed to load bill printing settings."
        );
      }

      if (printersError) {
        console.error(
          "BillPrintingSettings - printers:",
          printersError
        );
      }

      setPrinters(detectedPrinters || []);

      if (settings) {
        setPrintingMethod(
          settings.printing_method || "windows"
        );

        setPrinterName(
          settings.printer_name || ""
        );

        setPaperSize(
          settings.paper_size || "80mm"
        );
      }

      setLoading(false);
    };

    loadSettings();
  }, [hotelId]);

  const handleRefreshPrinters = async () => {
    await loadPrinters();
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    const { data, error: saveError } =
      await updateBillPrintSettings({
        hotelId,
        printingMethod,
        printerName,
        paperSize,
      });

    setSaving(false);

    if (saveError) {
      setError(
        saveError.message ||
          "Failed to save bill printing settings."
      );
      return;
    }

    if (data) {
      setPrintingMethod(
        data.printing_method
      );

      setPrinterName(
        data.printer_name || ""
      );

      setPaperSize(
        data.paper_size
      );
    }

    setSuccess(
      "Bill printing settings saved."
    );
  };

  if (loading) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Loading bill printing settings...
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
      {/* Header */}
      <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-700">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-700">
            <Printer
              size={20}
              className="text-zinc-700 dark:text-zinc-200"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Bill Printing
            </h2>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Configure how reception bills and receipts
              are printed.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400">
            {success}
          </div>
        )}

        {/* Printing Method */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Printing Method
          </h3>

          <div className="mt-3 space-y-3">
            {/* Windows */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 p-4 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-700/50">
              <input
                type="radio"
                name="printingMethod"
                value="windows"
                checked={
                  printingMethod === "windows"
                }
                onChange={() =>
                  setPrintingMethod("windows")
                }
                className="mt-1 accent-amber-600"
              />

              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Windows Printer
                </p>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Print bills using the Windows
                  printing system.
                </p>
              </div>
            </label>

            {/* Thermal */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 p-4 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-700/50">
              <input
                type="radio"
                name="printingMethod"
                value="thermal"
                className="mt-1 accent-amber-600"
                checked={
                  printingMethod === "thermal"
                }
                onChange={() =>
                  setPrintingMethod("thermal")
                }
                
              />

              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Thermal Printer
                </p>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Print directly using a compatible
                  ESC/POS thermal printer.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Printer */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Bill Printer
            </label>

            <button
              type="button"
              onClick={handleRefreshPrinters}
              disabled={printersLoading}
              className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <RefreshCw
                size={14}
                className={
                  printersLoading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>

          <select
            value={printerName}
            onChange={(e) =>
              setPrinterName(e.target.value)
            }
            disabled={printersLoading}
            className="w-full max-w-lg rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
          >
            <option value="">
              Select a printer
            </option>

            {printers.map((printer) => (
              <option
                key={printer.name}
                value={printer.name}
              >
                {printer.displayName ||
                  printer.name}
              </option>
            ))}
          </select>

          {printers.length === 0 ? (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              No printers were detected on this computer.
            </p>
          ) : (
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {printers.length} printer
              {printers.length !== 1
                ? "s"
                : ""}{" "}
              detected on this computer.
            </p>
          )}
        </div>

        {/* Paper Size */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-200">
            Paper Size
          </label>

          <select
            value={paperSize}
            onChange={(e) =>
              setPaperSize(e.target.value)
            }
            className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-gray-600 dark:bg-zinc-900 dark:text-white"
          >
            <option value="80mm">
              80mm
            </option>

            <option value="58mm">
              58mm
            </option>
          </select>
        </div>

        {/* Save */}
        <div className="flex justify-end border-t border-gray-200 pt-5 dark:border-gray-700">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm  text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-orange-600 dark:text-white dark:hover:bg-orange-500"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}