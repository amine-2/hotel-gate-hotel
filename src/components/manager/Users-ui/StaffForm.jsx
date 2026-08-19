import { useState } from "react";
import { addUser } from "../../../lib/users/addUser";

import AuthFields from "./AuthFields";
import PersonalFields from "./PersonalFields";
import RoleFields from "./RoleFields";
import UploadFields from "./UploadFields";

export default function StaffForm({ defaultRole = "", onSuccess, hidden = false }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    role: defaultRole,
    hotel_id: "",
    status: "active",
    avatar: null,
    cv: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const { success, error } = await addUser(form);

    if (!success) {
      setError(error.message);
      setLoading(false);
      return;
    }

    onSuccess && onSuccess();
    setLoading(false);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded shadow w-[80%] mx-auto dark:bg-zinc-800">

      <UploadFields form={form} onChange={handleChange} />

      <AuthFields form={form} onChange={handleChange} />

      <PersonalFields form={form} onChange={handleChange} />

      <RoleFields form={form} onChange={handleChange} hidden={hidden} />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black border border-black dark:bg-orange-500 dark:hover:bg-orange-600 dark:hover:text-white dark:border-orange-500 cursor-pointer"
      >
        {loading ? "Creating..." : "Create"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}