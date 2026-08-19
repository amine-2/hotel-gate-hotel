export default function ConfirmModal({
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "danger", // danger | warning | info
}) {
  const colors = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    info: "bg-green-500 hover:bg-green-600",
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
      <div className="bg-white w-105 rounded-xl p-6 space-y-4 shadow-lg dark:bg-zinc-800">
        
        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded dark:border-zinc-500 dark:bg-zinc-600 dark:hover:bg-zinc-500 cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded cursor-pointer ${colors[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}