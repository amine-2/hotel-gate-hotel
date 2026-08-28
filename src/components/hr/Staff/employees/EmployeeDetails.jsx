import { useEffect, useState } from "react";
import { getHotels } from "../../../../lib/hotels/getHotels";
import SelectField from "./SelectField";

function Field({ label, value, editing, onChange, type }) {
  

  return (
    <div className={`flex  ${editing ? "flex-col" : ""}`}>
      <p className="text-zinc-600 px-2 py-1 dark:text-zinc-400">
        {label}
        {editing ? "" : ": "}{" "}
      </p>

      {editing ? (
        <input
          type={type || "text"}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border p-2 rounded bg-transparent dark:bg-zinc-700 dark:border-zinc-500 dark:text-zinc-300 dark:scheme-dark"
        />
      ) : (
        <p className="px-2 py-1 dark:text-zinc-400">{value || "-"}</p>
      )}
    </div>
  );
}

export default function EmployeeDetails({ data, editing, onChange }) {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    const res = await getHotels();
    setHotels(res || []);
  };

  const selectedHotel = hotels.find((h) => h.id === data.hotel_id);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-zinc-600 ">
      <Field
        label="Phone"
        value={data.phone}
        editing={editing}
        onChange={(v) => onChange("phone", v)}
      />

      <Field
        label="Status"
        value={data.status}
        editing={editing}
        onChange={(v) => onChange("status", v)}
      />

      <Field
        label="Salary"
        value={data.salary}
        editing={editing}
        onChange={(v) => onChange("salary", v)}
      />

      <Field
        label="Hire Date"
        type="date"
        value={data.hire_date}
        editing={editing}
        onChange={(v) => onChange("hire_date", v)}
      />

      <Field
        label="Address"
        value={data.address}
        editing={editing}
        onChange={(v) => onChange("address", v)}
      />

      <Field
        label="National ID"
        value={data.national_id}
        editing={editing}
        onChange={(v) => onChange("national_id", v)}
      />

      <Field
        label="Last Update"
        value={new Date(data.updated_at).toISOString().split("T")[0]}
        editing={false}
        onChange={(v) => onChange("updated_at", v)}
      />
     
    </div>
  );
}
