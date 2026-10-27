import { app, BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

const execFileAsync = promisify(execFile);

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");

export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

/* =========================================================
   DEBUG LOGGER
   ========================================================= */

const logFile = path.join(app.getPath("userData"), "main.log");

function log(...args: any[]) {
  console.log(...args);

  try {
    fs.appendFileSync(
      logFile,
      `${args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg) : String(arg),
        )
        .join(" ")}\n`,
    );
  } catch (error) {
    console.error("Failed to write log file:", error);
  }
}

/* =========================================================
   AUTO UPDATER
   ========================================================= */

function setupAutoUpdater() {
  if (VITE_DEV_SERVER_URL) {
    log("[Updater] Development mode - updater disabled.");

    return;
  }

  log("[Updater] GH_TOKEN present:", !!process.env.GH_TOKEN_HOTEL);

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on("update-available", (info) => {
    log("[Updater] Update available:", info.version);

    win?.webContents.send("updater:update-available", {
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: info.releaseNotes,
    });
  });

  autoUpdater.on("update-not-available", (info) => {
    log("[Updater] No update available.");

    win?.webContents.send("updater:update-not-available", {
      version: info.version,
    });
  });

  autoUpdater.on("download-progress", (progress) => {
    log("[Updater] Download:", progress.percent);

    win?.webContents.send("updater:download-progress", {
      percent: progress.percent,
      transferred: progress.transferred,
      total: progress.total,
      bytesPerSecond: progress.bytesPerSecond,
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
    log("[Updater] Update downloaded:", info.version);

    win?.webContents.send("updater:update-downloaded", {
      version: info.version,
    });
  });

  autoUpdater.on("error", (error) => {
    log("[Updater] Error:", error?.message || error);

    win?.webContents.send("updater:error", {
      message: error?.message || "Update failed.",
    });
  });

  autoUpdater
    .checkForUpdates()
    .then((result) => {
      log("[Updater] Check result:", result?.updateInfo?.version);
    })
    .catch((error) => {
      log("[Updater] Initial update check failed:", error?.message || error);
    });
}

/* =========================================================
   WINDOW
   ========================================================= */

let win: BrowserWindow | null = null;

function createWindow() {
  log("Creating BrowserWindow...");

  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC!, "logo.png"),

    autoHideMenuBar: true,

    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      devTools: true,
    },
  });

  win.maximize();

  win.webContents.on("did-finish-load", () => {
    log("[Window] did-finish-load");

    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  win.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription, validatedURL) => {
      log("[Window] DID FAIL LOAD");

      log("errorCode:", errorCode);

      log("errorDescription:", errorDescription);

      log("validatedURL:", validatedURL);
    },
  );

  win.webContents.on("render-process-gone", (_event, details) => {
    log("[Window] Renderer process gone:", details);
  });

  win.webContents.on(
    "console-message",
    (_event, level, message, line, sourceId) => {
      log(
        `[Renderer] level=${level}`,
        `message=${message}`,
        `line=${line}`,
        `source=${sourceId}`,
      );
    },
  );

  /* =======================================================
     DEVELOPMENT
     ======================================================= */

  if (VITE_DEV_SERVER_URL) {
    log("[Window] Development mode");

    log("[Window] Loading:", VITE_DEV_SERVER_URL);

    win.loadURL(VITE_DEV_SERVER_URL);

    win.webContents.openDevTools();
  } else {
    /* =======================================================
     PRODUCTION
     ======================================================= */
    const indexPath = path.join(RENDERER_DIST, "index.html");

    log("========== PRODUCTION PATH ==========");

    log("APP_ROOT:", process.env.APP_ROOT);

    log("__dirname:", __dirname);

    log("RENDERER_DIST:", RENDERER_DIST);

    log("indexPath:", indexPath);

    log("index exists:", fs.existsSync(indexPath));

    log("=====================================");

    if (!fs.existsSync(indexPath)) {
      log("[ERROR] index.html DOES NOT EXIST");

      return;
    }

    log("[Window] Loading production index...");

    win
      .loadFile(indexPath)
      .then(() => {
        log("[Window] loadFile() succeeded");
      })
      .catch((error) => {
        log("[Window] loadFile() FAILED:", error?.message || error);
      });

    // Keep this for debugging the installed application.
    win.webContents.openDevTools();
  }
}

/* =========================================================
   UPDATER IPC
   ========================================================= */

ipcMain.handle("updater:check", async () => {
  if (VITE_DEV_SERVER_URL) {
    return {
      available: false,
      development: true,
    };
  }

  return autoUpdater.checkForUpdates();
});

ipcMain.handle("updater:download", async () => {
  if (VITE_DEV_SERVER_URL) {
    return {
      success: false,
      development: true,
    };
  }

  await autoUpdater.downloadUpdate();

  return {
    success: true,
  };
});

ipcMain.handle("updater:install", async () => {
  if (VITE_DEV_SERVER_URL) {
    return {
      success: false,
      development: true,
    };
  }

  autoUpdater.quitAndInstall(false, true);

  return {
    success: true,
  };
});

/* =========================================================
   BILL PRINTING - GET WINDOWS PRINTERS
   ========================================================= */

ipcMain.handle("bill-printing:get-printers", async (event) => {
  try {
    log("[Bill Printing] Getting Windows printers...");

    const printers = await event.sender.getPrintersAsync();

    log(
      "[Bill Printing] Printers detected:",
      printers.map((printer) => ({
        name: printer.name,
        displayName: printer.displayName,
      })),
    );

    return printers.map((printer) => ({
      name: printer.name,
      displayName: printer.displayName,
    }));
  } catch (error) {
    log("[Bill Printing] Failed to get printers:", error);

    throw error;
  }
});

/* =========================================================
   BILL PRINTING - THERMAL ESC/POS
   ========================================================= */

/* =========================================================
   BILL PRINTING - THERMAL ESC/POS BY WINDOWS PRINTER NAME
   ========================================================= */

ipcMain.handle("bill-printing:thermal-print", async (_event, data) => {
  const printerName = data?.printerName;
  const bytes = data?.bytes;

  log("========================================");

  log("[Thermal Print] PRINT REQUEST");

  log("[Thermal Print] Printer:", printerName);

  log("[Thermal Print] Bytes:", Array.isArray(bytes) ? bytes.length : 0);

  log("========================================");

  if (!printerName) {
    throw new Error("No thermal printer has been selected.");
  }

  if (!Array.isArray(bytes)) {
    throw new Error("Invalid thermal printer data.");
  }

  if (process.platform !== "win32") {
    throw new Error(
      "Raw thermal printing is currently supported only on Windows.",
    );
  }

  /*
   * Convert ESC/POS bytes to Base64.
   *
   * This lets us safely pass the binary data
   * to PowerShell without corrupting it.
   */
  const base64Data = Buffer.from(bytes).toString("base64");

  /*
   * Windows RAW printer spooler implementation.
   *
   * This sends the ESC/POS bytes directly to
   * the selected Windows printer.
   */
  const powershellScript = `
Add-Type @"
using System;
using System.Runtime.InteropServices;

public class RawPrinter
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public class DOCINFO
    {
        [MarshalAs(UnmanagedType.LPWStr)]
        public string pDocName;

        [MarshalAs(UnmanagedType.LPWStr)]
        public string pOutputFile;

        [MarshalAs(UnmanagedType.LPWStr)]
        public string pDataType;
    }

    [DllImport("winspool.drv", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool OpenPrinter(
        string pPrinterName,
        out IntPtr phPrinter,
        IntPtr pDefault
    );

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool ClosePrinter(
        IntPtr hPrinter
    );

    [DllImport("winspool.drv", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern int StartDocPrinter(
        IntPtr hPrinter,
        int Level,
        [In] DOCINFO pDocInfo
    );

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool EndDocPrinter(
        IntPtr hPrinter
    );

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool StartPagePrinter(
        IntPtr hPrinter
    );

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool EndPagePrinter(
        IntPtr hPrinter
    );

    [DllImport("winspool.drv", SetLastError = true)]
    public static extern bool WritePrinter(
        IntPtr hPrinter,
        byte[] pBytes,
        int dwCount,
        out int dwWritten
    );

    public static void Print(
        string printerName,
        byte[] data
    )
    {
        IntPtr printerHandle;

        if (!OpenPrinter(
            printerName,
            out printerHandle,
            IntPtr.Zero
        ))
        {
            throw new Exception(
                "OpenPrinter failed. Windows error: " +
                Marshal.GetLastWin32Error()
            );
        }

        try
        {
            DOCINFO docInfo =
                new DOCINFO();

            docInfo.pDocName =
                "Hotel Gates Bill";

            docInfo.pDataType =
                "RAW";

            int jobId =
                StartDocPrinter(
                    printerHandle,
                    1,
                    docInfo
                );

            if (jobId == 0)
            {
                throw new Exception(
                    "StartDocPrinter failed. Windows error: " +
                    Marshal.GetLastWin32Error()
                );
            }

            try
            {
                if (!StartPagePrinter(
                    printerHandle
                ))
                {
                    throw new Exception(
                        "StartPagePrinter failed. Windows error: " +
                        Marshal.GetLastWin32Error()
                    );
                }

                try
                {
                    int written;

                    bool result =
                        WritePrinter(
                            printerHandle,
                            data,
                            data.Length,
                            out written
                        );

                    if (!result)
                    {
                        throw new Exception(
                            "WritePrinter failed. Windows error: " +
                            Marshal.GetLastWin32Error()
                        );
                    }

                    if (written != data.Length)
                    {
                        throw new Exception(
                            "Printer received only " +
                            written +
                            " of " +
                            data.Length +
                            " bytes."
                        );
                    }
                }
                finally
                {
                    EndPagePrinter(
                        printerHandle
                    );
                }
            }
            finally
            {
                EndDocPrinter(
                    printerHandle
                );
            }
        }
        finally
        {
            ClosePrinter(
                printerHandle
            );
        }
    }
}
"@

$printerName = $env:HOTEL_GATES_PRINTER_NAME
$base64 = $env:HOTEL_GATES_BILL_BASE64

if ([string]::IsNullOrWhiteSpace($printerName)) {
    throw "Printer name was not provided."
}

if ([string]::IsNullOrWhiteSpace($base64)) {
    throw "Print data was not provided."
}

$data = [Convert]::FromBase64String($base64)

[RawPrinter]::Print(
    $printerName,
    $data
)
`;

  try {
    log("[Thermal Print] Sending RAW ESC/POS job to Windows...");

    await execFileAsync(
      "powershell.exe",
      [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        powershellScript,
      ],
      {
        windowsHide: true,
        maxBuffer: 1024 * 1024,
        env: {
          ...process.env,
          HOTEL_GATES_PRINTER_NAME: printerName,
          HOTEL_GATES_BILL_BASE64: base64Data,
        },
      },
    );
    log("[Thermal Print] RAW ESC/POS job sent successfully.");

    return {
      success: true,
    };
  } catch (error: any) {
    log(
      "[Thermal Print] ERROR:",
      error?.message || error?.stderr || String(error),
    );

    throw new Error(
      error?.message || error?.stderr || "Thermal printing failed.",
    );
    throw error;
  }
});

/* =========================================================
   BILL PRINTING - WINDOWS PRINTER
   ========================================================= */

ipcMain.handle("bill-printing:windows-print", async (_event, data) => {
  const printerName = data?.printerName;
  const html = data?.html;
  const paperSize = data?.paperSize || "80mm";

  log("========================================");
  log("[Windows Print] PRINT REQUEST");
  log("[Windows Print] Printer:", printerName);
  log("[Windows Print] Paper size:", paperSize);
  log("[Windows Print] HTML present:", !!html);
  log("========================================");

  if (!printerName) {
    log("[Windows Print] ERROR: No printer selected.");

    throw new Error("No bill printer has been selected.");
  }

  if (!html) {
    log("[Windows Print] ERROR: HTML missing.");

    throw new Error("Bill print content is missing.");
  }

  const printWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 1200,

    webPreferences: {
      sandbox: true,
    },
  });

  try {
    /* ---------------------------------------------------
         LOAD BILL HTML
         --------------------------------------------------- */

    log("[Windows Print] Preparing print window...");

    const pageLoaded = new Promise<void>((resolve, reject) => {
      printWindow.webContents.once("did-finish-load", () => {
        log("[Windows Print] did-finish-load received.");

        resolve();
      });

      printWindow.webContents.once(
        "did-fail-load",
        (_event, errorCode, errorDescription, validatedURL) => {
          log("[Windows Print] did-fail-load:");

          log("errorCode:", errorCode);

          log("errorDescription:", errorDescription);

          log("validatedURL:", validatedURL);

          reject(
            new Error(`Failed to load bill print page: ${errorDescription}`),
          );
        },
      );
    });

    log("[Windows Print] Loading bill HTML...");

    await printWindow.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(html)}`,
    );

    log("[Windows Print] loadURL completed.");

    await pageLoaded;

    log("[Windows Print] Bill page loaded successfully.");

    /* ---------------------------------------------------
         PAPER SIZE
         --------------------------------------------------- */

    const widthMicrons = paperSize === "58mm" ? 58000 : 80000;

    log("[Windows Print] Paper width:", widthMicrons, "microns");

    /* ---------------------------------------------------
         PRINT
         --------------------------------------------------- */

    log("[Windows Print] Calling webContents.print()...");

    await new Promise<void>((resolve, reject) => {
      printWindow.webContents.print(
        {
          silent: true,

          printBackground: true,

          deviceName: printerName,

          pageSize: {
            width: widthMicrons,
            height: 200000,
          },

          margins: {
            marginType: "none",
          },
        },

        (success, failureReason) => {
          log("[Windows Print] PRINT CALLBACK");

          log("[Windows Print] success:", success);

          log("[Windows Print] failureReason:", failureReason || "(none)");

          log("[Windows Print] printerName:", printerName);

          if (!success) {
            reject(new Error(failureReason || "Windows printing failed."));

            return;
          }

          resolve();
        },
      );
    });

    log("[Windows Print] Print completed successfully.");

    return {
      success: true,
    };
  } catch (error) {
    log("[Windows Print] PRINT ERROR:", error);

    throw error;
  } finally {
    log("[Windows Print] Closing print window...");

    if (!printWindow.isDestroyed()) {
      printWindow.close();
    }

    log("[Windows Print] Print window closed.");

    log("========================================");
  }
});

/* =========================================================
   ELECTRON LIFECYCLE
   ========================================================= */

app.whenReady().then(() => {
  log("Electron ready");

  createWindow();

  setupAutoUpdater();
});

app.on("window-all-closed", () => {
  log("All windows closed");

  if (process.platform !== "darwin") {
    app.quit();

    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
