export function getDateRange(filter) {
    const end = new Date();
    const start = new Date();

    switch (filter) {
        case "week":
            start.setDate(end.getDate() - 6);
            break;

        case "month":
            start.setDate(end.getDate() - 29);
            break;

        case "6months":
            start.setMonth(end.getMonth() - 6);
            break;

        case "year":
            start.setFullYear(end.getFullYear() - 1);
            break;

        default:
            start.setDate(end.getDate() - 6);
    }

    return {
        startDate: start.toISOString().split("T")[0],
        endDate: end.toISOString().split("T")[0],
    };
}