const tabs = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "pending",
    label: "Pending",
  },
  {
    key: "confirmed",
    label: "Confirmed",
  },
  {
    key: "cancelled",
    label: "Cancelled",
  },
];

export default function ReservationTabs({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="mt-6 border-b border-zinc-200 dark:border-zinc-700">
      <div className="flex gap-6">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-3 text-sm font-medium transition ${
                active
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {tab.label}

              {active && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-zinc-900 dark:bg-zinc-100" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}