import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createHotel } from "../../../../lib/hotels/createHotel";
import { getManagers } from "../../../../lib/Users/getManagers";

export default function AddHotel() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [managerId, setManagerId] = useState("");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      const data = await getManagers();
      setUsers(data);
    }

    loadUsers();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const result = await createHotel({
      name,
      city,
      managerId,
    });

    setLoading(false);

    if (!result) return;

    navigate("/dashboard/owner/hotels");
  }

  return (
    <div className=" w-full flex flex-col justify-center place-items-center mt-16">
      <h1 className="text-xl font-bold mb-6 text-zinc-800">
        Add Hotel
      </h1>

      <form onSubmit={handleSubmit} className="flex w-[80%] max-w-xl flex-col gap-4">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Hotel name"
          className="p-3 border border-zinc-300 rounded-xl dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
          required
        />

        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="p-3 border border-zinc-300 rounded-xl dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
          required
        />

        <select
          value={managerId}
          onChange={(e) => setManagerId(e.target.value)}
          className="p-3 border border-zinc-300 rounded-xl dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-300"
        >
          <option value="">Assign manager (optional)</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.full_name}
            </option>
          ))}
        </select>

        <button
          disabled={loading}
          className="bg-black text-white p-3 rounded-xl cursor-pointer hover:bg-zinc-800 
          transition dark:bg-orange-500 dark:hover:bg-zinc-900 
          dark:hover:text-orange-500 dark:hover:border dark:hover:border-orange-500 disabled:bg-zinc-400 
          disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Hotel"}
        </button>
      </form>
    </div>
  );
}