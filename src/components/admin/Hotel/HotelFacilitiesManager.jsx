import { useEffect, useState } from "react";

import { getFacilities } from "../../../lib/hotel/getFacilities";
import { getHotelFacilities } from "../../../lib/hotel/getHotelFacilities";
import { addHotelFacility } from "../../../lib/hotel/addHotelFacility";
import { removeHotelFacility } from "../../../lib/hotel/removeHotelFacility";
import AddFacilityModal from "./AddFacilityModal";

export default function HotelFacilitiesManager({ hotelId }) {
  const [facilities, setFacilities] = useState([]);
  const [hotelFacilities, setHotelFacilities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  function handleFacilityCreated(facility) {
    setFacilities((prev) =>
      [...prev, facility].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    );
  }

  useEffect(() => {
    if (!hotelId) return;

    async function loadFacilities() {
      setLoading(true);
      setError(null);

      const [
        { data: allFacilities, error: allError },
        { data: selectedFacilities, error: selectedError },
      ] = await Promise.all([
        getFacilities(),
        getHotelFacilities(hotelId),
      ]);

      if (allError) {
        console.error(
          "Failed to load facilities:",
          allError,
        );

        setError(allError.message);
      }

      if (selectedError) {
        console.error(
          "Failed to load hotel facilities:",
          selectedError,
        );

        setError(selectedError.message);
      }

      setFacilities(allFacilities || []);
      setHotelFacilities(selectedFacilities || []);

      setLoading(false);
    }

    loadFacilities();
  }, [hotelId]);

  async function handleAddFacility(facility) {
    setError(null);

    const alreadyAdded = hotelFacilities.some(
      (item) => item.id === facility.id,
    );

    if (alreadyAdded) return;

    const { error } = await addHotelFacility(
      hotelId,
      facility.id,
    );

    if (error) {
      console.error(
        "Failed to add facility:",
        error,
      );

      setError(error.message);
      return;
    }

    setHotelFacilities((prev) => [
      ...prev,
      facility,
    ]);
  }

  async function handleRemoveFacility(facilityId) {
    setError(null);

    const { error } =
      await removeHotelFacility(
        hotelId,
        facilityId,
      );

    if (error) {
      console.error(
        "Failed to remove facility:",
        error,
      );

      setError(error.message);
      return;
    }

    setHotelFacilities((prev) =>
      prev.filter(
        (item) => item.id !== facilityId,
      ),
    );
  }

  if (loading) {
    return (
      <section className="rounded-xl border bg-white p-6 dark:bg-zinc-800 dark:text-white dark:border-gray-700">
        <SectionHeader
          title="Facilities"
          description="Manage the facilities available at this hotel."
        />

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading facilities...
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-xl border bg-white p-6 dark:bg-zinc-800 dark:text-white dark:border-gray-700  ">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <SectionHeader
            title="Facilities"
            description="Manage the facilities available at this hotel."
          />

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-orange-500 dark:hover:bg-orange-600"
          >
            + Create Facility
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Current facilities */}
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-white">
            Hotel Facilities
          </h3>

          {hotelFacilities.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No facilities added yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {hotelFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className="flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2 dark:bg-zinc-700 dark:border-zinc-600"
                >
                  {facility.icon_url && (
                    <img
                      src={facility.icon_url}
                      alt=""
                      className="h-5 w-5 object-contain dark:invert"
                    />
                  )}

                  <span className="text-sm">
                    {facility.name}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveFacility(
                        facility.id,
                      )
                    }
                    className="ml-1 text-lg leading-none text-gray-400 hover:text-red-500 "
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available facilities */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-white">
            Add Facility
          </h3>

          {facilities.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No facilities available.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility) => {
                const selected =
                  hotelFacilities.some(
                    (item) =>
                      item.id === facility.id,
                  );

                return (
                  <button
                    key={facility.id}
                    type="button"
                    disabled={selected}
                    onClick={() =>
                      handleAddFacility(facility)
                    }
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                      selected
                        ? "cursor-default bg-gray-100 opacity-60 dark:bg-zinc-700 dark:border-zinc-600"
                        : "hover:border-black hover:bg-gray-50 dark:hover:bg-zinc-700 dark:hover:border-zinc-600"
                    }`}
                  >
                    {facility.icon_url && (
                      <img
                        src={facility.icon_url}
                        alt=""
                        className="h-6 w-6 object-contain"
                      />
                    )}

                    <span className="text-sm">
                      {facility.name}
                    </span>

                    {selected && (
                      <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                        Added
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Create Facility Modal */}
      {showAddModal && (
        <AddFacilityModal
          onClose={() => setShowAddModal(false)}
          onCreated={handleFacilityCreated}
        />
      )}
    </>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}
