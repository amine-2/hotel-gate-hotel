
import { X, Printer } from "lucide-react";

export default function PrintBillModal({
    open,
    bill,
    mode = "finalize",
    loading = false,
    onClose,
    onPrint,
}) {
    if (!open || !bill) {
        return null;
    }

    const items = Array.isArray(
        bill.charges?.items
    )
        ? bill.charges.items
        : [];

    const isReprint =
        mode === "reprint";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-gray-900">

                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {isReprint
                                ? "Print Bill Again"
                                : "Print Bill"}
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isReprint
                                ? "This bill is already finalized."
                                : "Review the bill before printing."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto px-6 py-5">

                    <div className="mb-5 text-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {bill.hotel?.name?.en ||
                                "Hotel Gates"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Room{" "}
                            {bill.room?.room_number ||
                                "-"}
                        </p>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-500 dark:text-gray-400">
                                Guest
                            </span>

                            <span className="font-medium text-gray-900 dark:text-white">
                                {bill.booking?.name ||
                                    "-"}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-gray-500 dark:text-gray-400">
                                Check-in
                            </span>

                            <span className="font-medium text-gray-900 dark:text-white">
                                {bill.booking
                                    ?.check_in_date ||
                                    "-"}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-gray-500 dark:text-gray-400">
                                Check-out
                            </span>

                            <span className="font-medium text-gray-900 dark:text-white">
                                {bill.booking
                                    ?.check_out_date ||
                                    "-"}
                            </span>
                        </div>
                    </div>

                    <div className="my-5 border-t border-gray-200 dark:border-gray-800" />

                    <div className="space-y-3">
                        {items.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No charges have been added.
                            </p>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between gap-4"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {item.name}
                                        </p>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {item.quantity} ×{" "}
                                            {Number(
                                                item.unit_price
                                            ).toLocaleString()}{" "}
                                            DZD
                                        </p>
                                    </div>

                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {Number(
                                            item.total
                                        ).toLocaleString()}{" "}
                                        DZD
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="my-5 border-t border-gray-200 dark:border-gray-800" />

                    <div className="space-y-2 text-sm">

                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">
                                Subtotal
                            </span>

                            <span className="text-gray-900 dark:text-white">
                                {Number(
                                    bill.charges?.subtotal ||
                                        0
                                ).toLocaleString()}{" "}
                                DZD
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">
                                Discount
                            </span>

                            <span className="text-gray-900 dark:text-white">
                                {Number(
                                    bill.charges?.discount ||
                                        0
                                ).toLocaleString()}{" "}
                                DZD
                            </span>
                        </div>

                        <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold dark:border-gray-800">
                            <span className="text-gray-900 dark:text-white">
                                Total
                            </span>

                            <span className="text-gray-900 dark:text-white">
                                {Number(
                                    bill.charges?.total ||
                                        0
                                ).toLocaleString()}{" "}
                                DZD
                            </span>
                        </div>

                    </div>

                    {!isReprint && (
                        <div className="mt-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                            Once the bill is printed successfully,
                            it will be finalized and can no longer
                            be modified.
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-800">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onPrint}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg bg-orange-400 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Printer size={17} />

                        {loading
                            ? "Printing..."
                            : isReprint
                            ? "Print Again"
                            : "Print & Finalize"}
                    </button>

                </div>
            </div>
        </div>
    );
}