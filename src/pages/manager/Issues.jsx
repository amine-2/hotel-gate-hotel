import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../auth/AuthContext";

import AddIssueModal from "../../components/AddIssueModal";
import IssuesList from "../../components/IssuesList";
import IssueDetailsModal from "../../components/IssueDetailsModal";
import { useHotel } from "../../auth/HotelContext";

import { getIssuesByHotelNull } from "../../lib/issues/getIssuesByHotelNull";
import { updateIssue } from "../../lib/issues/updateIssue";
import { deleteIssue } from "../../lib/issues/deleteIssue";

export default function Issues() {
  const { user, profile } = useAuth();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const { hotelId } = useHotel();

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    fetchIssues();
  }, [hotelId]);

  const fetchIssues = async () => {
    setLoading(true);

    const data = await getIssuesByHotelNull(hotelId);

    setIssues(data || []);
    setLoading(false);
  };

  /* ---------------- HANDLERS ---------------- */

  const handleCreate = (newIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
  };

  const handleUpdate = async (updatedIssue) => {
    const res = await updateIssue(updatedIssue.id, {
      status: updatedIssue.status,
      updated_by: profile?.id,
    });

    if (res) {
      setIssues((prev) => prev.map((i) => (i.id === res.id ? res : i)));
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteIssue(id);

    if (success) {
      setIssues((prev) => prev.filter((i) => i.id !== id));
    }
  };

  /* ---------------- GROUP BY CATEGORY ---------------- */

  const groupedIssues = useMemo(() => {
    const groups = {};

    issues.forEach((issue) => {
      const category = issue.category || "Uncategorized";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(issue);
    });

    return groups;
  }, [issues]);

  /* ---------------- UI ---------------- */

  if (loading) {
    return <div className="p-6 text-zinc-500">Loading issues...</div>;
  }

  return (
    <div className="p-14">
      {/* HEADER */}
      <div className="flex justify-between items-center pb-14">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Issues</h2>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded dark:bg-orange-500
          dark:text-white dark:hover:bg-orange-600 transition cursor-pointer"
        >
          + Add Issue
        </button>
      </div>

      {/* GROUPED LIST */}
      <div className="space-y-6">
        {Object.entries(groupedIssues).map(([category, items]) => (
          <div key={category} className="space-y-2">
            {/* CATEGORY TITLE */}
            <h3 className="text-md font-semibold text-zinc-700 dark:text-zinc-300">
              {category}
            </h3>

            {/* ISSUES */}
            <IssuesList issues={items} onSelect={setSelectedIssue} />
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {openCreate && (
        <AddIssueModal
          showHotelSelector={true}
          userId={profile?.id}
          onClose={() => setOpenCreate(false)}
          onCreated={handleCreate}
          
        />
      )}

      {/* DETAILS MODAL */}
      {selectedIssue && (
        <IssueDetailsModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
