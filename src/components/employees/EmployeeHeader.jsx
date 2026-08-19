import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getRoles } from "../../lib/Users/getRoles";
import AddRoleModal from "./../manager/Users-ui/AddRoleModal";

export default function EmployeeHeader({ data, editing, onChange }) {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };
   const handleRoleAdded = (newRole) => {
    setRoles((prev) => [...prev, newRole]);
    setOpen(false);
    onChange("role", newRole.value);
  };

  // 🔥 get role label
  const roleLabel = roles.find((r) => r.value === data.role)?.name || data.role;

  return (
    <div className=" p-4 rounded-xl flex justify-between items-center border border-zinc-600 dark:border-zinc-600">
      {/* LEFT */}
      <div>
        {editing ? (
          <input
            value={data.full_name}
            onChange={(e) => onChange("full_name", e.target.value)}
            className="text-2xl border-b bg-transparent"
          />
        ) : (
          <h1 className="text-2xl font-semibold">{data.full_name}</h1>
        )}

        <p className="text-sm text-zinc-400">{roleLabel}</p>
      </div>

      {/* RIGHT */}
      <div>
        {editing && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-400">Role</label>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-zinc-400 hover:text-white dark:hover:text-white cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            <select
              value={data.role || ""}
              onChange={(e) => onChange("role", e.target.value)}
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-500 dark:text-zinc-300"
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.value}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {open && (
        <AddRoleModal
          onClose={() => setOpen(false)}
          onSuccess={handleRoleAdded}
        />
      )}
    </div>
  );
}
