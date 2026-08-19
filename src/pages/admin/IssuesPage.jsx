import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../auth/AuthContext";

import AddIssueModal from "../../components/AddIssueModal";
import IssuesList from "../../components/IssuesList";
import IssueDetailsModal from "../../components/IssueDetailsModal";
import HotelFilter from "../../components/manager/Staff/ui/HotelFilter";

import { getIssuesByHotel } from "../../lib/issues/getIssuesByHotel";
import { getAllIssues } from "../../lib/issues/getAllIssues";
import { updateIssue } from "../../lib/issues/updateIssue";
import { deleteIssue } from "../../lib/issues/deleteIssue";

const ALLOWED_CATEGORIES = [
    "website",
    "system",
];

export default function IssuesPage() {
    const { profile } = useAuth();

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    const [hotelFilter, setHotelFilter] =
        useState("all");

    const [openCreate, setOpenCreate] =
        useState(false);

    const [selectedIssue, setSelectedIssue] =
        useState(null);

    /* ---------------- FETCH ---------------- */

    useEffect(() => {
        fetchIssues();
    }, [hotelFilter]);

    const fetchIssues = async () => {
        setLoading(true);

        try {
            let data;

            if (hotelFilter === "all") {
                data = await getAllIssues();
            } else {
                data =
                    await getIssuesByHotel(
                        hotelFilter
                    );
            }

            /*
             * Website Manager can only see:
             *
             * website
             * system
             */
            const filteredIssues =
                (data || []).filter((issue) =>
                    ALLOWED_CATEGORIES.includes(
                        issue.category
                    )
                );

            setIssues(filteredIssues);
        } catch (error) {
            console.error(
                "Failed to fetch issues:",
                error
            );

            setIssues([]);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- HANDLERS ---------------- */

    const handleCreate = (newIssue) => {
        /*
         * Extra protection in case something
         * outside the modal creates an issue.
         */
        if (
            !ALLOWED_CATEGORIES.includes(
                newIssue?.category
            )
        ) {
            return;
        }

        setIssues((prev) => [
            newIssue,
            ...prev,
        ]);
    };

    const handleUpdate = async (
        updatedIssue
    ) => {
        const res = await updateIssue(
            updatedIssue.id,
            {
                status:
                    updatedIssue.status,
                updated_by:
                    profile?.id,
            }
        );

        if (res) {
            setIssues((prev) =>
                prev.map((issue) =>
                    issue.id === res.id
                        ? res
                        : issue
                )
            );
        }
    };

    const handleDelete = async (id) => {
        const success =
            await deleteIssue(id);

        if (success) {
            setIssues((prev) =>
                prev.filter(
                    (issue) =>
                        issue.id !== id
                )
            );
        }
    };

    /* ---------------- GROUP BY CATEGORY ---------------- */

    const groupedIssues = useMemo(() => {
        const groups = {};

        issues.forEach((issue) => {
            /*
             * Safety check so even if something
             * gets inserted into state later,
             * unsupported categories never appear.
             */
            if (
                !ALLOWED_CATEGORIES.includes(
                    issue.category
                )
            ) {
                return;
            }

            const category =
                issue.category;

            if (!groups[category]) {
                groups[category] = [];
            }

            groups[category].push(issue);
        });

        return groups;
    }, [issues]);

    /* ---------------- UI ---------------- */

    if (loading) {
        return (
            <div className="p-6 text-zinc-500">
                Loading issues...
            </div>
        );
    }

    return (
        <div className="p-14">

            {/* HEADER */}

            <div className="flex items-center justify-between pb-14">

                <div className="flex items-center gap-4">

                    <h2 className="text-xl font-semibold">
                        Issues
                    </h2>

                    <HotelFilter
                        value={hotelFilter}
                        onChange={
                            setHotelFilter
                        }
                    />

                </div>

                <button
                    onClick={() =>
                        setOpenCreate(true)
                    }
                    className="cursor-pointer rounded bg-black px-4 py-2 text-white transition hover:bg-gray-800 dark:bg-orange-500 dark:hover:bg-orange-600"
                >
                    + Add Issue
                </button>

            </div>

            {/* GROUPED LIST */}

            <div className="space-y-6">

                {Object.entries(
                    groupedIssues
                ).map(
                    ([category, items]) => (
                        <div
                            key={category}
                            className="space-y-2"
                        >

                            <h3 className="text-md font-semibold text-zinc-700 dark:text-zinc-300">
                                {category}
                            </h3>

                            <IssuesList
                                issues={items}
                                onSelect={
                                    setSelectedIssue
                                }
                            />

                        </div>
                    )
                )}

                {Object.keys(
                    groupedIssues
                ).length === 0 && (
                    <div className="py-12 text-center text-sm text-zinc-500">
                        No website or system issues found.
                    </div>
                )}

            </div>

            {/* CREATE MODAL */}

            {openCreate && (
                <AddIssueModal
                    showHotelSelector={true}
                    userId={profile?.id}
                    allowedCategories={[
                        "website",
                        "system",
                    ]}
                    onClose={() =>
                        setOpenCreate(false)
                    }
                    onCreated={
                        handleCreate
                    }
                />
            )}

            {/* DETAILS MODAL */}

            {selectedIssue && (
                <IssueDetailsModal
                    issue={selectedIssue}
                    onClose={() =>
                        setSelectedIssue(null)
                    }
                    onUpdate={
                        handleUpdate
                    }
                    onDelete={
                        handleDelete
                    }
                />
            )}

        </div>
    );
}