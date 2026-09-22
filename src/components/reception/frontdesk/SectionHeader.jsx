export default function SectionHeader({ icon: Icon, title, count }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5 dark:border-zinc-700">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          <Icon size={18} />
        </div>

        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          {title}
        </h2>

      </div>

      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        {count}
      </span>

    </div>
  );
}