import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";

import { useHotel } from "../../../auth/HotelContext";
import useApplications from "../../../hooks/useApplications";

import ApplicationCard from "./ApplicationCard";
import AddApplicationModal from "./AddApplicationModal";
import ApplicationDetails from "./ApplicationDetails";

export default function ApplicationsSection({ position, onBack }) {
  const { hotelId } = useHotel();

  const { applications, loading, error, reload } = useApplications({
    hotelId,
    positionId: position.id,
  });

  const [selectedApplication, setSelectedApplication] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);

  /*
   * Candidate details
   */
  if (selectedApplication) {
    return (
      <ApplicationDetails
        application={selectedApplication}
        hotelId={hotelId}
        onBack={() => setSelectedApplication(null)}
        onUpdated={(updated) => {
          setSelectedApplication(updated);
          reload();
        }}
        onDeleted={() => {
          setSelectedApplication(null);
          reload();
        }}
      />
    );
  }
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              {position.title}
            </h2>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Applications
            </p>
          </div>
        </div>

        {/* ADD APPLICATION */}
        <button
          onClick={() => setOpenAdd(true)}
          disabled={position.status !== "open"}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
            bg-zinc-900 text-white hover:bg-zinc-700
            disabled:opacity-40 disabled:cursor-not-allowed
            dark:bg-orange-500 dark:hover:bg-orange-600"
        >
          <Plus size={17} />
          Add Application
        </button>
      </div>

      {/* CLOSED NOTICE */}
      {position.status === "closed" && (
        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-4 text-sm text-zinc-500 dark:text-zinc-400">
          This position is closed. New applications cannot be added.
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 rounded-xl bg-zinc-100 animate-pulse dark:bg-zinc-800"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 p-6 text-red-500">
          Failed to load applications.
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-10 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            No applications yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onClick={() => setSelectedApplication(application)}
            />
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      {openAdd && (
        <AddApplicationModal
          hotelId={hotelId}
          position={position}
          onClose={() => setOpenAdd(false)}
          onSuccess={() => {
            setOpenAdd(false);
            reload();
          }}
        />
      )}
    </div>
  );
}
