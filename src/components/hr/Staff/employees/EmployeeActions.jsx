import { useState } from "react";
import ConfirmModal from "../../../../components/ConfirmModal";
import { updateEmployee } from "../../../../lib/users/updateEmployee";
import { deleteEmployee } from "../../../../lib/users/deleteEmployee";

export default function EmployeeActions({ data, onRefresh }) {
  const [modal, setModal] = useState(null);

  const isActive = data.status === "active";

  // 🔥 STATUS TOGGLE
  const handleToggleStatus = async () => {
    await updateEmployee(data.id, {
      status: isActive ? "inactive" : "active",
    });

    setModal(null);
    onRefresh && onRefresh();
  };

  // 🔥 DELETE
  const handleDelete = async () => {
    await deleteEmployee(data.id);

    setModal(null);

    // redirect or refresh handled outside
    onRefresh && onRefresh();
  };

  return (
    <div className="p-4 border border-zinc-600 rounded-xl space-y-4">

      <h3 className="text-lg font-semibold">Actions</h3>

      {/* STATUS */}
      <div className="flex justify-between items-center bg-zinc-100 p-3 rounded dark:bg-zinc-700">
        <div>
          <p className="font-medium text-left ">
            {isActive ? "Deactivate Employee" : "Activate Employee"}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {isActive
              ? "This employee will no longer be able to access the system."
              : "This employee will regain access to the system."}
          </p>
        </div>

        <button
          onClick={() => setModal("status")}
          className={`px-4 py-2 rounded ${
            isActive
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-green-600 hover:bg-green-700"
          } text-white`}
        >
          {isActive ? "Deactivate" : "Activate"}
        </button>
      </div>

      {/* DELETE */}
      <div className="flex justify-between items-center bg-red-200 p-3 rounded dark:bg-red-900">
        <div>
          <p className="font-medium text-red-600 text-left dark:text-red-300 ">
            Delete Employee
          </p>
          <p className="text-sm text-red-400 dark:text-red-300">
            This action is permanent. The employee and all related data will be removed.
          </p>
        </div>

        <button
          onClick={() => setModal("delete")}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Delete
        </button>
      </div>

      {/* 🔥 CONFIRM MODAL */}
      {modal === "status" && (
        <ConfirmModal
          title={isActive ? "Deactivate Employee?" : "Activate Employee?"}
          message={
            isActive
              ? "The employee will lose access to the system."
              : "The employee will regain access."
          }
          type={isActive ? "warning" : "info"}
          onConfirm={handleToggleStatus}
          onCancel={() => setModal(null)}
        />
      )}

      {modal === "delete" && (
        <ConfirmModal
          title="Delete Employee?"
          message="This action cannot be undone."
          type="danger"
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}