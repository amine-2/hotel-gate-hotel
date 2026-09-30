import THERMAL_LOGO from "./thermalLogo";

function encodeText(text) {
  return new TextEncoder().encode(text);
}

function concatBytes(...arrays) {
  const totalLength = arrays.reduce((sum, array) => sum + array.length, 0);

  const result = new Uint8Array(totalLength);

  let offset = 0;

  for (const array of arrays) {
    result.set(array, offset);
    offset += array.length;
  }

  return result;
}

function command(...bytes) {
  return new Uint8Array(bytes);
}

function textLine(text = "") {
  return encodeText(`${text}\n`);
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("en-US")} DZD`;
}

function padLine(left, right, width = 42) {
  const leftText = String(left);
  const rightText = String(right);

  const spaces = Math.max(width - leftText.length - rightText.length, 1);

  return `${leftText}${" ".repeat(spaces)}${rightText}`;
}

export function buildThermalBillBytes({
  hotelName,
  hotelLocation,
  booking,
  room,
  charges,
}) {
  const ESC = 0x1b;
  const GS = 0x1d;

  const bytes = [];

  bytes.push(command(ESC, 0x40));

  // Center
  bytes.push(command(ESC, 0x61, 0x01));

  // Logo
  bytes.push(THERMAL_LOGO);

  // Space after logo
  bytes.push(textLine(""));

  // Bold
  bytes.push(command(ESC, 0x45, 0x01));

  bytes.push(textLine(hotelName?.en || "HOTEL GATES"));

  bytes.push(command(ESC, 0x45, 0x00));

  if (hotelLocation) {
    bytes.push(textLine(hotelLocation?.city?.en || "Oran"));
  }

  bytes.push(textLine(""));

  // Left align
  bytes.push(command(ESC, 0x61, 0x00));

  bytes.push(textLine(`Guest: ${booking?.name || "-"}`));

  bytes.push(textLine(`Room: ${room?.room_number || "-"}`));

  bytes.push(textLine(`Booking: ${booking?.id || "-"}`));

  bytes.push(textLine(`Check-in: ${booking?.check_in_date || "-"}`));

  bytes.push(textLine(`Check-out: ${booking?.check_out_date || "-"}`));

  bytes.push(textLine(""));

  bytes.push(textLine("-".repeat(42)));

  bytes.push(textLine(padLine("ITEM", "TOTAL")));

  bytes.push(textLine("-".repeat(42)));

  const items = Array.isArray(charges?.items) ? charges.items : [];
  const BOTTOM_FEED_LINES = 10;

  for (const item of items) {
    const name = String(item.name || "Charge");

    const quantity = Number(item.quantity || 0);

    const total = formatMoney(item.total);

    const itemName = quantity > 1 ? `${name} x${quantity}` : name;

    bytes.push(textLine(padLine(itemName.slice(0, 30), total)));
  }

  bytes.push(textLine("-".repeat(42)));

  bytes.push(textLine(padLine("Subtotal", formatMoney(charges?.subtotal))));

  bytes.push(textLine(padLine("Discount", formatMoney(charges?.discount))));

  bytes.push(command(ESC, 0x45, 0x01));

  bytes.push(textLine(padLine("TOTAL", formatMoney(charges?.total))));

  bytes.push(command(ESC, 0x45, 0x00));

  bytes.push(textLine(""));

  bytes.push(command(ESC, 0x61, 0x01));

  bytes.push(textLine("Thank you for staying with us!"));

  for (let i = 0; i < BOTTOM_FEED_LINES; i++) {
    bytes.push(textLine(""));
  }

  bytes.push(command(GS, 0x56, 0x00));
  return concatBytes(...bytes);
}

export async function printThermalBill(data) {
  if (!window.ipcRenderer?.printThermalBill) {
    return {
      success: false,
      error: new Error("Thermal bill printing is not available."),
    };
  }

  if (!data?.printerName) {
    return {
      success: false,
      error: new Error("No thermal printer has been selected."),
    };
  }

  try {
    // KEEP YOUR EXISTING ESC/POS BILL BUILDING CODE HERE

    const bytes = buildThermalBillBytes(data);

    const result = await window.ipcRenderer.printThermalBill({
      printerName: data.printerName,
      bytes: Array.from(bytes),
    });

    return {
      success: true,
      data: result,
      error: null,
    };
  } catch (error) {
    console.error("printThermalBill:", error);

    return {
      success: false,
      error,
    };
  }
}
