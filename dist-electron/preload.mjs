"use strict";
const electron = require("electron");
const updater = {
  /*
   * -----------------------------------------------------
   * CHECK FOR UPDATE
   * -----------------------------------------------------
   */
  checkForUpdate: () => {
    return electron.ipcRenderer.invoke(
      "updater:check"
    );
  },
  /*
   * -----------------------------------------------------
   * DOWNLOAD UPDATE
   * -----------------------------------------------------
   */
  downloadUpdate: () => {
    return electron.ipcRenderer.invoke(
      "updater:download"
    );
  },
  /*
   * -----------------------------------------------------
   * INSTALL UPDATE
   * -----------------------------------------------------
   */
  installUpdate: () => {
    return electron.ipcRenderer.invoke(
      "updater:install"
    );
  },
  /*
   * -----------------------------------------------------
   * UPDATE AVAILABLE
   * -----------------------------------------------------
   */
  onUpdateAvailable: (callback) => {
    const listener = (_event, data) => {
      callback(data);
    };
    electron.ipcRenderer.on(
      "updater:update-available",
      listener
    );
    return () => {
      electron.ipcRenderer.removeListener(
        "updater:update-available",
        listener
      );
    };
  },
  /*
   * -----------------------------------------------------
   * NO UPDATE
   * -----------------------------------------------------
   */
  onUpdateNotAvailable: (callback) => {
    const listener = (_event, data) => {
      callback(data);
    };
    electron.ipcRenderer.on(
      "updater:update-not-available",
      listener
    );
    return () => {
      electron.ipcRenderer.removeListener(
        "updater:update-not-available",
        listener
      );
    };
  },
  /*
   * -----------------------------------------------------
   * DOWNLOAD PROGRESS
   * -----------------------------------------------------
   */
  onDownloadProgress: (callback) => {
    const listener = (_event, data) => {
      callback(data);
    };
    electron.ipcRenderer.on(
      "updater:download-progress",
      listener
    );
    return () => {
      electron.ipcRenderer.removeListener(
        "updater:download-progress",
        listener
      );
    };
  },
  /*
   * -----------------------------------------------------
   * UPDATE DOWNLOADED
   * -----------------------------------------------------
   */
  onUpdateDownloaded: (callback) => {
    const listener = (_event, data) => {
      callback(data);
    };
    electron.ipcRenderer.on(
      "updater:update-downloaded",
      listener
    );
    return () => {
      electron.ipcRenderer.removeListener(
        "updater:update-downloaded",
        listener
      );
    };
  },
  /*
   * -----------------------------------------------------
   * ERROR
   * -----------------------------------------------------
   */
  onUpdateError: (callback) => {
    const listener = (_event, data) => {
      callback(data);
    };
    electron.ipcRenderer.on(
      "updater:error",
      listener
    );
    return () => {
      electron.ipcRenderer.removeListener(
        "updater:error",
        listener
      );
    };
  }
};
electron.contextBridge.exposeInMainWorld(
  "electronUpdater",
  updater
);
