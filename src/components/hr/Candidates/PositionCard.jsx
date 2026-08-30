import {
  BriefcaseBusiness,
  ChevronRight,
  PenLine,
  Trash2,
} from "lucide-react";

export default function PositionCard({
  position,
  onClick,
  onEdit,
  onDelete,
}) {
  const isOpen = position.status === "open";

  return (
    <div
      className="group rounded-xl border border-zinc-200 bg-white p-5
        hover:border-zinc-400 hover:shadow-sm transition
        dark:bg-zinc-800 dark:border-zinc-700 dark:hover:border-zinc-500"
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-4">

        {/* POSITION INFO */}
        <button
          type="button"
          onClick={onClick}
          className="flex items-start gap-3 min-w-0 flex-1 text-left cursor-pointer"
        >
          <div className="shrink-0 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-700">
            <BriefcaseBusiness
              size={20}
              className="text-zinc-600 dark:text-zinc-300"
            />
          </div>

          <div className="min-w-0 pt-0.5">
            <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
              {position.title}
            </h3>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {position.description || "No description"}
            </p>
          </div>
        </button>

        {/* ACTIONS */}
        <div className="flex items-center gap-1 shrink-0">

          {/* EDIT */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(position);
            }}
            title="Edit position"
            className="p-2 rounded-lg text-zinc-400
              hover:text-zinc-900 hover:bg-zinc-100
              dark:hover:text-white dark:hover:bg-zinc-700
              cursor-pointer transition"
          >
            <PenLine size={16} />
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(position);
            }}
            title="Delete position"
            className="p-2 rounded-lg text-zinc-400
              hover:text-red-600 hover:bg-red-50
              dark:hover:text-red-400 dark:hover:bg-red-900/20
              cursor-pointer transition"
          >
            <Trash2 size={16} />
          </button>

          {/* OPEN */}
          <button
            type="button"
            onClick={onClick}
            title="View applications"
            className="p-2 rounded-lg text-zinc-400
              hover:text-zinc-900 hover:bg-zinc-100
              dark:hover:text-white dark:hover:bg-zinc-700
              cursor-pointer transition"
          >
            <ChevronRight size={18} />
          </button>

        </div>
      </div>

      {/* STATUS */}
      <div className="mt-5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isOpen
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isOpen
                ? "bg-green-500"
                : "bg-zinc-400"
            }`}
          />

          {isOpen ? "Open" : "Closed"}
        </span>
      </div>
    </div>
  );
}