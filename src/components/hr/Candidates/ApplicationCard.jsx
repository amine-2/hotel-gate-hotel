import { ChevronRight, UserRound } from "lucide-react";

const statusStyles = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  reviewing:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  interview:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  accepted:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function ApplicationCard({
  application,
  onClick,
}) {
  const status =
    statusStyles[application.status] ||
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl border border-zinc-200 bg-white p-4
        hover:border-zinc-400 hover:shadow-sm transition
        dark:bg-zinc-800 dark:border-zinc-700 dark:hover:border-zinc-500
        cursor-pointer"
    >
      <div className="flex items-center gap-4">

        {/* AVATAR */}
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center shrink-0">
          <UserRound
            size={19}
            className="text-zinc-500 dark:text-zinc-300"
          />
        </div>

        {/* INFO */}
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-zinc-900 dark:text-white truncate">
            {application.full_name}
          </h3>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
            {application.email ||
              application.phone ||
              "No contact information"}
          </p>
        </div>

        {/* STATUS */}
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${status}`}
        >
          {application.status}
        </span>

        <ChevronRight
          size={18}
          className="text-zinc-400 shrink-0"
        />
      </div>
    </button>
  );
}