import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getRoles } from "../../../lib/Users/getRoles";
import { getHotels } from "../../../lib/hotels/getHotels";
import AddRoleModal from "./AddRoleModal";

const EXCLUDED_ROLES = ["hotel_manager", "owner", "website_admin", "hr"];

export default function RoleFields({ form, onChange, hidden }) {
  const [roles, setRoles] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadRoles();
    loadHotels();
  }, []);

  const loadRoles = async () => {
    const data = await getRoles();

    const filteredRoles = (data || []).filter(
      (role) => !EXCLUDED_ROLES.includes(role.value)
    );

    setRoles(filteredRoles);
  };

  const loadHotels = async () => {
    const data = await getHotels();
    setHotels(data);
  };

  const handleRoleAdded = (newRole) => {
    if (EXCLUDED_ROLES.includes(newRole.value)) return;

    setRoles((prev) => [...prev, newRole]);
    setOpen(false);
    onChange("role", newRole.value);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Role & Assignment</h3>

      {/* ROLE */}
      {!hidden && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm text-zinc-400">Role</label>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-zinc-400 hover:text-white"
            >
              <Plus size={16} />
            </button>
          </div>

          <select
            value={form.role || ""}
            onChange={(e) => onChange("role", e.target.value)}
            className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
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

      

      {/* STATUS */}
      <select
        value={form.status}
        onChange={(e) => onChange("status", e.target.value)}
        className="w-full p-2 border rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {/* ROLE MODAL */}
      {open && (
        <AddRoleModal
          onClose={() => setOpen(false)}
          onSuccess={handleRoleAdded}
        />
      )}
    </div>
  );
}