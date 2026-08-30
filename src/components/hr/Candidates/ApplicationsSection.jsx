import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import ApplicationCard from "./ApplicationCard";
import AddApplicationModal from "./AddApplicationModal";

export default function ApplicationsSection({
  position,
  onBack,
  onSelectApplication,
}) {
  const [openAdd, setOpenAdd] = useState(false);

  const applications = [];

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-semibold">
              {position.title}
            </h1>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Applications
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 cursor-pointer dark:bg-orange-500 dark:hover:bg-orange-600"
        >
          <Plus size={17} />
          Add Application
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-10 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            No applications for this position.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onClick={() =>
                onSelectApplication(application)
              }
            />
          ))}
        </div>
      )}

      {openAdd && (
        <AddApplicationModal
          position={position}
          onClose={() => setOpenAdd(false)}
          onSuccess={() => setOpenAdd(false)}
        />
      )}
    </>
  );
}