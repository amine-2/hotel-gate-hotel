function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatMoney(value) {
    return `${Number(value || 0).toLocaleString("en-US")} DZD`;
}

function getLocationText(location) {
    if (!location) {
        return "";
    }

    if (typeof location === "string") {
        return location;
    }

    if (typeof location === "object") {
        return (
            location.address ||
            location.city ||
            location.name ||
            ""
        );
    }

    return "";
}

export function buildWindowsBillHtml({
    hotelName,
    hotelLocation,
    booking,
    room,
    charges,
}) {
    const items = Array.isArray(charges?.items)
        ? charges.items
        : [];

    const locationText =
        getLocationText(hotelLocation);

    const itemRows = items
        .map(
            (item) => `
                <tr>
                    <td>
                        ${escapeHtml(
                            item.name || "Charge"
                        )}
                        ${
                            Number(item.quantity) > 1
                                ? ` × ${Number(
                                      item.quantity
                                  )}`
                                : ""
                        }
                    </td>

                    <td class="amount">
                        ${escapeHtml(
                            formatMoney(item.total)
                        )}
                    </td>
                </tr>
            `
        )
        .join("");

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />

<style>
    @page {
        margin: 0;
    }

    * {
        box-sizing: border-box;
    }

    html,
    body {
        margin: 0;
        padding: 0;
        background: white;
    }

    body {
        font-family: Arial, Helvetica, sans-serif;
        color: #111;
        font-size: 12px;
    }

    .receipt {
        width: 100%;
        padding: 18px;
    }

    .header {
        text-align: center;
        margin-bottom: 14px;
    }

    .hotel-name {
        font-size: 20px;
        font-weight: 700;
    }

    .hotel-location {
        margin-top: 4px;
        color: #555;
    }

    .separator {
        border-top: 1px solid #111;
        margin: 12px 0;
    }

    .details {
        margin-bottom: 12px;
    }

    .details-row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin: 4px 0;
    }

    .details-label {
        font-weight: 600;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: 6px 0;
        border-bottom: 1px solid #ddd;
        text-align: left;
    }

    th:last-child,
    td:last-child {
        text-align: right;
    }

    .totals {
        margin-top: 10px;
    }

    .total-row {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
    }

    .grand-total {
        font-size: 16px;
        font-weight: 700;
        margin-top: 6px;
        padding-top: 8px;
        border-top: 1px solid #111;
    }

    .footer {
        text-align: center;
        margin-top: 24px;
        color: #555;
    }
</style>
</head>

<body>
    <div class="receipt">

        <div class="header">
            <div class="hotel-name">
                ${escapeHtml(
                    hotelName || "HOTEL GATES"
                )}
            </div>

            ${
                locationText
                    ? `
                        <div class="hotel-location">
                            ${escapeHtml(locationText)}
                        </div>
                    `
                    : ""
            }
        </div>

        <div class="separator"></div>

        <div class="details">

            <div class="details-row">
                <span class="details-label">
                    Guest
                </span>

                <span>
                    ${escapeHtml(
                        booking?.name || "-"
                    )}
                </span>
            </div>

            <div class="details-row">
                <span class="details-label">
                    Room
                </span>

                <span>
                    ${escapeHtml(
                        room?.room_number || "-"
                    )}
                </span>
            </div>

            <div class="details-row">
                <span class="details-label">
                    Booking
                </span>

                <span>
                    ${escapeHtml(
                        booking?.id || "-"
                    )}
                </span>
            </div>

            <div class="details-row">
                <span class="details-label">
                    Check-in
                </span>

                <span>
                    ${escapeHtml(
                        booking?.check_in_date || "-"
                    )}
                </span>
            </div>

            <div class="details-row">
                <span class="details-label">
                    Check-out
                </span>

                <span>
                    ${escapeHtml(
                        booking?.check_out_date || "-"
                    )}
                </span>
            </div>

        </div>

        <div class="separator"></div>

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Total</th>
                </tr>
            </thead>

            <tbody>
                ${itemRows}
            </tbody>
        </table>

        <div class="totals">

            <div class="total-row">
                <span>Subtotal</span>
                <span>
                    ${escapeHtml(
                        formatMoney(
                            charges?.subtotal
                        )
                    )}
                </span>
            </div>

            <div class="total-row">
                <span>Discount</span>
                <span>
                    ${escapeHtml(
                        formatMoney(
                            charges?.discount
                        )
                    )}
                </span>
            </div>

            <div class="total-row grand-total">
                <span>TOTAL</span>
                <span>
                    ${escapeHtml(
                        formatMoney(
                            charges?.total
                        )
                    )}
                </span>
            </div>

        </div>

        <div class="footer">
            Thank you for staying with us!
        </div>

    </div>
</body>
</html>
    `;
}

export async function printWindowsBill(data) {
    if (!window.ipcRenderer?.printWindowsBill) {
        return {
            success: false,
            error: new Error(
                "Windows bill printing is not available."
            ),
        };
    }

    if (!data?.printerName) {
        return {
            success: false,
            error: new Error(
                "No bill printer has been selected."
            ),
        };
    }

    try {
        const html = buildWindowsBillHtml(data);

        const result =
            await window.ipcRenderer.printWindowsBill({
                printerName: data.printerName,
                paperSize:
                    data.paperSize || "80mm",
                html,
            });

        return {
            success: true,
            data: result,
            error: null,
        };
    } catch (error) {
        console.error(
            "printWindowsBill:",
            error
        );

        return {
            success: false,
            error,
        };
    }
}