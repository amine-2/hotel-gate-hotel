import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AddOwnerForm() {
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(field, value) {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      const { email, password, full_name } = form;

      if (!email || !password || !full_name) return;

      // 1. Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      const userId = data.user?.id;

      if (!userId) throw new Error("User ID missing");

      // 2. Insert profile as OWNER
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          full_name,
          email,
          role: "owner",
          status: "active"
        });

      if (profileError) throw profileError;

      // reset form
      setForm({
        email: "",
        full_name: "",
        password: ""
      });

      alert("Owner account created");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" rounded-2xl p-6 border dark:border-gray-400">
      <h2 className="text-lg font-semibold">
        Create Owner Account
      </h2>
<div className="flex justify-around w-full p-6">
      <input
        placeholder="Full Name"
        value={form.full_name}
        onChange={e =>
          handleChange("full_name", e.target.value)
        }
        className="border rounded px-4 py-2 dark:bg-gray-700 dark:border-gray-500"
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={e =>
          handleChange("email", e.target.value)
        }
        className="border rounded px-4 py-2 dark:bg-gray-700 dark:border-gray-500"
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e =>
          handleChange("password", e.target.value)
        }
        className="border rounded px-4 py-2 dark:bg-gray-700 dark:border-gray-500"
      />

      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-zinc-900 text-white hover:bg-white hover:text-black border
         border-zinc-900 px-4 py-2 rounded-lg cursor-pointer dark:bg-orange-500 dark:border-orange-500 dark:hover:bg-orange-600 dark:hover:text-white"
      >
        {loading ? "Creating..." : "Create Owner"}
      </button>
    </div>
  );
}