import {
    contextBridge,
    ipcRenderer,
} from "electron";

/* =========================================================
   AUTO UPDATER API
   ========================================================= */

const updater = {
    /*
     * -----------------------------------------------------
     * CHECK FOR UPDATE
     * -----------------------------------------------------
     */

    checkForUpdate: () => {
        return ipcRenderer.invoke(
            "updater:check"
        );
    },

    /*
     * -----------------------------------------------------
     * DOWNLOAD UPDATE
     * -----------------------------------------------------
     */

    downloadUpdate: () => {
        return ipcRenderer.invoke(
            "updater:download"
        );
    },

    /*
     * -----------------------------------------------------
     * INSTALL UPDATE
     * -----------------------------------------------------
     */

    installUpdate: () => {
        return ipcRenderer.invoke(
            "updater:install"
        );
    },

    /*
     * -----------------------------------------------------
     * UPDATE AVAILABLE
     * -----------------------------------------------------
     */

    onUpdateAvailable: (
        callback
    ) => {
        const listener = (
           _event,
            data
        ) => {
            callback(data);
        };

        ipcRenderer.on(
            "updater:update-available",
            listener
        );

        return () => {
            ipcRenderer.removeListener(
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

    onUpdateNotAvailable: (
        callback
    ) => {
        const listener = (
            _event,
            data
        ) => {
            callback(data);
        };

        ipcRenderer.on(
            "updater:update-not-available",
            listener
        );

        return () => {
            ipcRenderer.removeListener(
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

    onDownloadProgress: (
        callback
    ) => {
        const listener = (
            _event,
            data
        ) => {
            callback(data);
        };

        ipcRenderer.on(
            "updater:download-progress",
            listener
        );

        return () => {
            ipcRenderer.removeListener(
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

    onUpdateDownloaded: (
        callback
    ) => {
        const listener = (
            _event,
            data
        ) => {
            callback(data);
        };

        ipcRenderer.on(
            "updater:update-downloaded",
            listener
        );

        return () => {
            ipcRenderer.removeListener(
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

    onUpdateError: (
        callback
    ) => {
        const listener = (
            _event,
            data
        ) => {
            callback(data);
        };

        ipcRenderer.on(
            "updater:error",
            listener
        );

        return () => {
            ipcRenderer.removeListener(
                "updater:error",
                listener
            );
        };
    },
};

/* =========================================================
   EXPOSE API TO REACT
   ========================================================= */

contextBridge.exposeInMainWorld(
    "electronUpdater",
    updater
);

/* =========================================================
   IPC API
   ========================================================= */
const ipc = {
    on: (channel, callback) => {
        const listener = (_event, data) => {
            callback(data);
        };

        ipcRenderer.on(channel, listener);

        return () => {
            ipcRenderer.removeListener(channel, listener);
        };
    },

    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },

    invoke: (channel, data) => {
        return ipcRenderer.invoke(channel, data);
    },
};

contextBridge.exposeInMainWorld(
    "ipcRenderer",
    ipc
);