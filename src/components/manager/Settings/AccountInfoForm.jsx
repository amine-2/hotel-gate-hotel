import { useEffect, useState } from "react";
import { getAccountInfo, updateAccountInfo } from "../../../lib/Users/account";

export default function AccountInfoForm() {
  const [data, setData] = useState(null);
  const [initial, setInitial] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const res = await getAccountInfo();
    setData(res);
    setInitial(res);
  }

  if (!data) return <div>Loading...</div>;

  const isDirty =
    JSON.stringify(data) !== JSON.stringify(initial);

  async function handleSave() {
    try {
      setSaving(true);
      await updateAccountInfo(data);
      setInitial(data);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="  p-6 rounded-2xl border dark:border-gray-400">
      <h2 className="text-lg font-semibold mb-10">Account Info</h2>

     <div className="flex justify-around w-full">
      <input
        value={data.full_name || ""}
        onChange={e =>
          setData(prev => ({
            ...prev,
            full_name: e.target.value
          }))
        }
        placeholder="Full Name"
        className="border rounded px-4 py-2 w-1/3 dark:bg-gray-700 dark:border-gray-500"
      />

      <input
        value={data.email || ""}
        disabled
        className="opacity-50 px-4 py-2 w-1/3  rounded"
      />

      {isDirty && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-500 hover:bg-green-600 px-4 text-white py-1 rounded-lg cursor-pointer"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      )}
    </div>
    </div>
  );
}