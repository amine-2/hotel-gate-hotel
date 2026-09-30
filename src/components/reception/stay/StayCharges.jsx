function money(value) {
  return `${Number(value || 0).toLocaleString()} DZD`;
}

export default function StayCharges({ charges }) {
  const items = Array.isArray(charges?.items)
    ? charges.items
    : [];

  return (
    <section className="rounded-xl border border-gray-200 shadow dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Charges
        </h2>

        {charges?.is_finalized && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Finalized
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">
          No additional charges.
        </p>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-zinc-700">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="flex items-center justify-between py-3"
            >
              <div>
                <p className="text-sm font-medium">
                  {item.name ||
                    item.description ||
                    "Charge"}
                </p>

                {item.quantity && (
                  <p className="text-xs text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                )}
              </div>

              <p className="text-sm font-medium">
                {money(
                  item.total ??
                    item.amount ??
                    item.price ??
                    0
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-gray-200 dark:border-zinc-700 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Subtotal
          </span>
          <span>{money(charges?.subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Discount
          </span>
          <span>
            -{money(charges?.discount)}
          </span>
        </div>

        <div className="flex justify-between text-base font-semibold pt-2">
          <span>Total</span>
          <span>{money(charges?.total)}</span>
        </div>
      </div>

      {charges?.is_finalized && charges?.finalized_at && (
        <div className="mt-4 text-xs text-gray-500">
          Finalized on{" "}
          {new Date(
            charges.finalized_at
          ).toLocaleString()}
          {charges.finalized_by_profile?.full_name
            ? ` by ${charges.finalized_by_profile.full_name}`
            : ""}
        </div>
      )}
    </section>
  );
}