// components/FilterDropdown.jsx
import React from "react";

export default function FilterDropdown({  value, onChange, options = [] }) {
  return (
    <div className="  absolute right-10 z-20  ">
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-full border-zinc-400 px-1 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}