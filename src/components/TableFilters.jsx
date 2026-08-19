import { useTranslation } from "react-i18next"; 

export default function TableFilters({
  dateFilter,
  setDateFilter,
  search,
  setSearch,
  status,
  setStatus,
  statusOptions = [],
}) {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-wrap gap-4 items-center">

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder={t("search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-1 rounded-md dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
      />

      {/* 📅 Date */}
      <select
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        className="border px-2 py-1 rounded-md dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
      >
        <option value="week">7 {t("days")}</option>
        <option value="month">30 {t("days")}</option>
        <option value="6months">6 {t("months")}</option>
        <option value="year">1 {t("year")}</option>
      </select>

      {/* 🟡 Status */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border px-2 py-1 rounded-md dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
      >
        <option value="all">{t("all")}</option>
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {t(s)}
          </option>
        ))}
      </select>

    </div>
  );
}