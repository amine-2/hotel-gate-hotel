import { app, BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

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
  fs.appendFileSync(logFile, `${args.join(" ")}\n`);
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

    win?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );
  });

  win.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
    log("[Window] DID FAIL LOAD");
    log("errorCode:", errorCode);
    log("errorDescription:", errorDescription);
    log("validatedURL:", validatedURL);
  });

  win.webContents.on("render-process-gone", (_event, details) => {
    log("[Window] Renderer process gone:", details);
  });

  win.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    log(
      `[Renderer] level=${level}`,
      `message=${message}`,
      `line=${line}`,
      `source=${sourceId}`
    );
  });


  /* =======================================================
     DEVELOPMENT
     ======================================================= */

  if (VITE_DEV_SERVER_URL) {
    log("[Window] Development mode");
    log("[Window] Loading:", VITE_DEV_SERVER_URL);

    win.loadURL(VITE_DEV_SERVER_URL);

    win.webContents.openDevTools();
  }

  /* =======================================================
     PRODUCTION
     ======================================================= */

  else {
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