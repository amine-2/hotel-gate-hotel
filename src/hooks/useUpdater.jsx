import { useEffect, useState } from "react";

export function useUpdater() {
  const [update, setUpdate] = useState(null);
  const [checking, setChecking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updater = window.electronUpdater;

    if (!updater) {
      console.warn("Electron updater API is unavailable.");
      return;
    }

    const removeAvailable = updater.onUpdateAvailable((data) => {
      setUpdate(data);
      setDownloaded(false);
      setDownloading(false);
      setProgress(0);
      setError(null);
      setChecking(false);
    });

    const removeNotAvailable = updater.onUpdateNotAvailable(() => {
      setChecking(false);
    });

    const removeProgress = updater.onDownloadProgress((data) => {
      setDownloading(true);
      setProgress(data?.percent || 0);
    });

    const removeDownloaded = updater.onUpdateDownloaded((data) => {
      setDownloading(false);
      setDownloaded(true);
      setProgress(100);

      setUpdate((current) => ({
        ...current,
        ...data,
      }));
    });

    const removeError = updater.onUpdateError((data) => {
      setChecking(false);
      setDownloading(false);

      setError(
        data?.message || "Update failed."
      );
    });

    return () => {
      removeAvailable?.();
      removeNotAvailable?.();
      removeProgress?.();
      removeDownloaded?.();
      removeError?.();
    };
  }, []);

  async function checkForUpdate() {
    if (!window.electronUpdater) return;

    setChecking(true);
    setError(null);

    try {
      const result =
        await window.electronUpdater.checkForUpdate();

      setChecking(false);

      return result;
    } catch (err) {
      setChecking(false);

      setError(
        err?.message ||
          "Unable to check for updates."
      );
    }
  }

  async function downloadUpdate() {
    if (!window.electronUpdater) return;

    setError(null);
    setDownloading(true);
    setProgress(0);

    try {
      await window.electronUpdater.downloadUpdate();
    } catch (err) {
      setDownloading(false);

      setError(
        err?.message ||
          "Unable to download update."
      );
    }
  }

  function installUpdate() {
    if (!window.electronUpdater) return;

    window.electronUpdater.installUpdate();
  }

  return {
    update,
    checking,
    downloading,
    downloaded,
    progress,
    error,

    checkForUpdate,
    downloadUpdate,
    installUpdate,
  };
}