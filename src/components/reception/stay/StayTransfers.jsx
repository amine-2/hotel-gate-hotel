import { ArrowRight } from "lucide-react";

export default function StayTransfers({ transfers = [] }) {
  return (
    <section className="rounded-xl border border-gray-200 shadow dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Room Transfers
        </h2>

        <span className="text-xs text-gray-500">
          {transfers.length} transfer
          {transfers.length !== 1 ? "s" : ""}
        </span>
      </div>

      {transfers.length === 0 ? (
        <p className="text-sm text-gray-500">
          No room transfers for this stay.
        </p>
      ) : (
        <div className="space-y-3">
          {transfers.map((transfer) => (
            <div
              key={transfer.id}
              className="rounded-lg border border-gray-200 dark:border-zinc-700 p-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-medium">
                  Room {transfer.from_room?.room_number || "-"}
                </span>

                <ArrowRight
                  size={16}
                  className="text-gray-400"
                />

                <span className="font-medium">
                  Room {transfer.to_room?.room_number || "-"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div>
                  <p className="text-xs text-gray-500">
                    Transferred by
                  </p>
                  <p className="text-sm mt-1">
                    {transfer.transferred_by_profile?.full_name ||
                      "Unknown employee"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Date
                  </p>
                  <p className="text-sm mt-1">
                    {new Date(
                      transfer.transferred_at
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Difference
                  </p>
                  <p className="text-sm mt-1">
                    {Number(
                      transfer.difference_amount || 0
                    ).toLocaleString()}{" "}
                    DZD
                  </p>
                </div>
              </div>

              {transfer.reason && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500">
                    Reason
                  </p>

                  <p className="text-sm mt-1">
                    {transfer.reason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}