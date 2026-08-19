import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import ExpandButton from "./ExpandButton";
import { ClockArrowDown } from "lucide-react";
import { CircleX } from "lucide-react";
import { CircleCheckBig } from "lucide-react";
import { timeAgo } from "../services/timeAgo";

export default function IssueDetailsModal({
  issue,
  onClose,
  onUpdate,
  onDelete,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [action, setAction] = useState(null);

  const changeStatus = async (status) => {
    await onUpdate({ ...issue, status });
    onClose();
  };

  const handleDelete = async () => {
    await onDelete(issue.id);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 ">
        <div className="bg-white w-170 rounded-xl p-6 space-y-4 dark:bg-zinc-800 dark:text-zinc-300">
          {/* Header */}
          <h2 className="text-xl font-semibold">{issue.title}</h2>

          <div className="p-4 border border-zinc-600 rounded space-y-3 dark:border-zinc-300">
            <p className="text-sm text-zinc-600 text-left dark:text-zinc-300">
              {issue.description}
            </p>
          </div>
          <div className=" flex justify-between text-xs text-zinc-500 space-y-1 dark:text-zinc-300">
            <p>
              <span className="font-medium">Hotel:</span>{" "}
              {issue.hotel?.name?.en || "Global"}
            </p>

            <p>
              <span className="font-medium">Created by:</span>{" "}
              {issue.creator?.full_name || "—"} • {timeAgo(issue.created_at)}
            </p>

            <p>
              <span className="font-medium">Updated by:</span>{" "}
              {issue.updater?.full_name || "—"} • {timeAgo(issue.updated_at)}
            </p>
          </div>

          {/* Meta */}
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 border border-zinc-300 rounded text-zinc-700 dark:text-zinc-300">
              {issue.category}
            </span>
            <span className="px-2 py-1 border border-zinc-300 rounded text-zinc-700 dark:text-zinc-300">
              {issue.urgency}
            </span>
            <span className="px-2 py-1 border border-zinc-300 rounded text-zinc-700 dark:text-zinc-300">
              {issue.status}
            </span>
          </div>

          {/* Actions */}

          <div>
            <p className="text-sm font-medium text-zinc-700 text-left dark:text-zinc-500">
              Update issue status:{" "}
            </p>
            <div className="flex gap-2 pt-4">
              <ExpandButton
                onClick={() => changeStatus("in_progress")}
                className="px-3 py-2 bg-blue-500 text-white rounded"
                icon={<ClockArrowDown size={18} />}
                label={"In Progress"}
              />

              <ExpandButton
                onClick={() => changeStatus("resolved")}
                className="px-3 py-1 bg-green-500 text-white rounded"
                icon={<CircleCheckBig size={18} />}
                label={"Resolved"}
              />

              <ExpandButton
                onClick={() => {
                  setAction("close");
                  setConfirmOpen(true);
                }}
                className="px-3 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition dark:bg-red-500 dark:hover:bg-red-600"
                icon={<CircleX size={18} />}
                label={"Close"}
              />
            </div>
          </div>
          <div className="flex w-full justify-end items-end gap-2 pt-4">
            <button
              onClick={() => {
                setAction("delete");
                setConfirmOpen(true);
              }}
              className="px-3 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>

            <button onClick={onClose} className="px-3 py-2 border rounded">
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {confirmOpen && (
        <ConfirmModal
          title={action === "delete" ? "Delete Issue" : "Close Issue"}
          message={
            action === "delete"
              ? "This action cannot be undone."
              : "This issue will be marked as closed."
          }
          confirmText="Yes"
          type={action === "delete" ? "danger" : "warning"}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);

            if (action === "delete") handleDelete();
            if (action === "close") changeStatus("closed");
          }}
        />
      )}
    </>
  );
}
