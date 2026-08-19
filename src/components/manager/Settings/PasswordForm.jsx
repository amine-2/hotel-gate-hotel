import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChangePassword() {
    try {
      setLoading(true);

      const {
        data: { user }
      } = await supabase.auth.getUser();

      // re-auth
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: current
        });

      if (loginError) {
        alert("Wrong current password");
        return;
      }

      // update password
      const { error } = await supabase.auth.updateUser({
        password: next
      });

      if (error) throw error;

      alert("Password updated successfully");
      setCurrent("");
      setNext("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border p-6 rounded-2xl space-y-4 dark:border-gray-400">
      <h2 className="text-lg font-semibold">Security</h2>
      
      <div className="flex justify-around w-full">
      <input
        type="password"
        placeholder="Current password"
        value={current}
        onChange={e => setCurrent(e.target.value)}
        className="border rounded px-4 py-2 dark:bg-gray-700 dark:border-gray-500"
      />

      <input
        type="password"
        placeholder="New password"
        value={next}
        onChange={e => setNext(e.target.value)}
        className="border rounded px-4 py-2 dark:bg-gray-700 dark:border-gray-500"
      />
      

      <button
        onClick={handleChangePassword}
        disabled={loading}
        className="bg-zinc-900 border border-zinc-900 px-4 py-2 rounded-lg text-white
         hover:bg-white hover:text-black cursor-pointer dark:bg-orange-500 dark:border-orange-500 dark:hover:bg-orange-600 dark:hover:text-white"
      >
        {loading ? "Updating..." : "Change Password"}
      </button>
      </div>
    </div>
  );
}