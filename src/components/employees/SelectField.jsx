  
  export default function  SelectField({ label, value, editing, onChange, options, getLabel }) {
  return (
    <div className={`flex ${editing ? "flex-col" : ""}`}>
      <p className="text-zinc-600 px-2 py-1 dark:text-zinc-400">
        {label}{editing ? "" : ":"}
      </p>

      {editing ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border p-2 rounded bg-transparent dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300 dark:scheme-dark"
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {getLabel(opt)}
            </option>
          ))}
        </select>
      ) : (
        <p className="px-2 py-1 dark:text-zinc-400">
          {getLabel(options.find(o => o.id === value)) || "-"}
        </p>
      )}
    </div>
  );
}