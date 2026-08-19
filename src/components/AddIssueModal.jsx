import { useEffect, useState } from "react";
import { createIssue } from "../lib/issues/createIssue";
import { getHotels } from "../lib/hotels/getHotels";

const DEFAULT_CATEGORIES = [
    {
        value: "maintenance",
        label: "Maintenance",
    },
    {
        value: "cleaning",
        label: "Cleaning",
    },
    {
        value: "service",
        label: "Service",
    },
    {
        value: "guest",
        label: "Guest",
    },
    {
        value: "system",
        label: "System",
    },
    {
        value: "security",
        label: "Security",
    },
    {
        value: "website",
        label: "Website",
    },
    {
        value: "other",
        label: "Other",
    },
];

export default function AddIssueModal({
    hotelId,
    userId,
    onClose,
    onCreated,
    showHotelSelector = false,

    // New
    allowedCategories = null,
}) {
    const [hotels, setHotels] = useState([]);

    /*
     * If allowedCategories is provided,
     * only those categories are available.
     *
     * Otherwise keep the existing Manager behavior.
     */
    const categories =
        allowedCategories?.length
            ? DEFAULT_CATEGORIES.filter((category) =>
                allowedCategories.includes(
                    category.value
                )
            )
            : DEFAULT_CATEGORIES;

    const [form, setForm] = useState({
        title: "",
        description: "",
        category:
            categories[0]?.value || "maintenance",
        urgency: "low",
        hotel_id: hotelId || "",
    });

    useEffect(() => {
        if (showHotelSelector) {
            loadHotels();
        }
    }, [showHotelSelector]);

    const loadHotels = async () => {
        const data = await getHotels();

        setHotels(data || []);
    };

    const lang = "en";

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        /*
         * Extra protection:
         * never allow a category outside
         * the configured list.
         */
        if (
            allowedCategories?.length &&
            !allowedCategories.includes(
                form.category
            )
        ) {
            return;
        }

        const payload = {
            hotel_id:
                form.hotel_id || hotelId,

            created_by: userId,

            status: "open",

            title: form.title,

            description:
                form.description,

            category:
                form.category,

            urgency:
                form.urgency,
        };

        const newIssue =
            await createIssue(payload);

        if (newIssue) {
            onCreated?.(newIssue);

            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-125 space-y-4 rounded-xl bg-white p-6 dark:bg-zinc-800 dark:text-zinc-300">

                <h2 className="text-lg font-semibold">
                    Create Issue
                </h2>

                {/* TITLE */}

                <input
                    name="title"
                    placeholder="Issue title"
                    className="w-full rounded border p-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    onChange={handleChange}
                />

                {/* DESCRIPTION */}

                <textarea
                    name="description"
                    placeholder="Description"
                    className="w-full rounded border p-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    onChange={handleChange}
                />

                {/* CATEGORY */}

                <select
                    name="category"
                    value={form.category}
                    className="w-full rounded border p-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    onChange={handleChange}
                >
                    {categories.map(
                        (category) => (
                            <option
                                key={
                                    category.value
                                }
                                value={
                                    category.value
                                }
                            >
                                {
                                    category.label
                                }
                            </option>
                        )
                    )}
                </select>

                {/* URGENCY */}

                <select
                    name="urgency"
                    value={form.urgency}
                    className="w-full rounded border p-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    onChange={handleChange}
                >
                    <option value="low">
                        Low
                    </option>

                    <option value="medium">
                        Medium
                    </option>

                    <option value="high">
                        High
                    </option>

                    <option value="critical">
                        Critical
                    </option>
                </select>

                {/* HOTEL */}

                {showHotelSelector && (
                    <select
                        name="hotel_id"
                        className="w-full rounded border p-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                        value={
                            form.hotel_id
                        }
                        onChange={
                            handleChange
                        }
                    >
                        <option value="">
                            Select hotel
                        </option>

                        {hotels.map((h) => (
                            <option
                                key={h.id}
                                value={h.id}
                            >
                                {h.name?.[
                                    lang
                                ] ||
                                    "No name"}
                            </option>
                        ))}
                    </select>
                )}

                {/* ACTIONS */}

                <div className="flex justify-end gap-2">

                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded border px-4 py-2 transition hover:bg-gray-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="cursor-pointer rounded bg-black px-4 py-2 text-white transition hover:bg-gray-800 dark:bg-orange-500 dark:hover:bg-orange-600"
                    >
                        Create
                    </button>

                </div>

            </div>

        </div>
    );
}