import { ChevronRight } from "lucide-react";

export default function ApplicationCard({
  application,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 text-left hover:border-zinc-400 transition cursor-pointer dark:bg-zinc-800 dark:border-zinc-700"
    >
      <div>
        <h3 className="font-medium text-zinc-900 dark:text-white">
          {application.full_name}
        </h3>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {application.email}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="px-2.5 py-1 rounded-full text-xs bg-zinc-100 dark:bg-zinc-700">
          {application.status}
        </span>

        <ChevronRight
          size={18}
          className="text-zinc-400"
        />
      </div>
    </button>
  );
}