import { useState } from "react";
import { supabase } from "../../../lib/supabase";


export default function AddRoleModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const handleSave = async () => {
    const { data, error } = await supabase
      .from("roles")
      .insert({ name, value })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    onSuccess(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white shadow-lg p-6 rounded-xl w-96 space-y-4 dark:bg-zinc-800 dark:text-white">

        <h2 className="text-lg font-semibold">Add Role</h2>

        <input
          placeholder="Role name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 bg-zinc-100 rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
        />

        <input
          placeholder="Role value (e.g. hotel_manager)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 bg-zinc-100 rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700 border border-zinc-300 px-3 py-1 rounded cursor-pointer dark:border-zinc-600 dark:text-zinc-400 dark:hover:text-white">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-green-600 px-3 py-1 rounded text-white hover:bg-green-500 transition cursor-pointer dark:bg-green-600 dark:hover:bg-green-500"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}