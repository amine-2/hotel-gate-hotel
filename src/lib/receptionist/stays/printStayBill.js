import { getBillPrintSettings } from "../settings/getBillPrintSettings";

import { printThermalBill } from "./thermalBillPrinter";
import { printWindowsBill } from "./windowsBillPrinter";

export async function printStayBill({
    hotelId,
    bill,
}) {
    if (!hotelId) {
        return {
            success: false,
            error: new Error(
                "Hotel ID is required."
            ),
        };
    }

    if (!bill) {
        return {
            success: false,
            error: new Error(
                "Bill data is required."
            ),
        };
    }

    const {
        data: settings,
        error: settingsError,
    } = await getBillPrintSettings(
        hotelId
    );

    if (settingsError) {
        return {
            success: false,
            error: settingsError,
        };
    }

    if (!settings) {
        return {
            success: false,
            error: new Error(
                "Bill printing has not been configured yet. Please configure it in Receptionist Settings."
            ),
        };
    }

    const {
        printing_method: printingMethod,
        printer_name: printerName,
        paper_size: paperSize,
    } = settings;

    if (!printerName) {
        return {
            success: false,
            error: new Error(
                "No bill printer has been selected."
            ),
        };
    }

    const printData = {
        hotelName: bill.hotel?.name,
        hotelLocation: bill.hotel?.location,

        booking: bill.booking,
        room: bill.room,
        stay: bill.stay,
        charges: bill.charges,

        printerName,
        paperSize,
    };

    if (printingMethod === "thermal") {
        return printThermalBill(
            printData
        );
    }

    if (printingMethod === "windows") {
        return printWindowsBill(
            printData
        );
    }

    return {
        success: false,
        error: new Error(
            "Unsupported bill printing method."
        ),
    };
}