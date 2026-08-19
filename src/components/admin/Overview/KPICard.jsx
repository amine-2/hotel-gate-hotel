import { TrendingUp, TrendingDown } from "lucide-react";
import useCountUp from "../../../hooks/useCountUp";
export default function KPICard({ title, value, growth }) {
  const { count, ref } = useCountUp(value, 1600);
  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl p-6 dark:bg-zinc-800 dark:text-zinc-300 
    shadow flex items-center flex-col gap-4"
    >
      <p className="text-gray-500 text-lg dark:text-zinc-400">
        {title || "no data"}
      </p>

      <h2 className="text-2xl font-bold">
        {value !== undefined ? count.toLocaleString() : "no data"} { title === 'Conversion' ? '%' :''}
      </h2>

      <span
        className={`text-sm font-medium  flex p-0.5 rounded-lg bg-amber-950 ${
          growth >= 0
            ? "text-green-600 bg-green-200 dark:bg-green-900 dark:text-green-400"
            : "text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-400"
        }`}
      >
        {growth !== undefined ?growth.toFixed(1) : "0"}%
        {growth >= 0 ? (
          <TrendingUp className="text-green-600 h-4" />
        ) : (
          <TrendingDown className="text-red-500 h-4" />
        )}
      </span>
    </div>
  );
}
