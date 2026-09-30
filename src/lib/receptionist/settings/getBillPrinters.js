export async function getBillPrinters() {
  if (!window.ipcRenderer?.getBillPrinters) {
    return {
      data: [],
      error: new Error(
        "Bill printer access is not available."
      ),
    };
  }

  try {
    const printers =
      await window.ipcRenderer.getBillPrinters();

    return {
      data: Array.isArray(printers)
        ? printers
        : [],
      error: null,
    };
  } catch (error) {
    console.error(
      "getBillPrinters:",
      error
    );

    return {
      data: [],
      error,
    };
  }
}