import { useEffect, useState } from "react";
import { useUpdater } from "../../hooks/useUpdater";
import UpdateModal from "./UpdateModal";

export default function UpdateManager() {
  const {
    update,
    checking,
    downloading,
    downloaded,
    progress,
    error,
    checkForUpdate,
    downloadUpdate,
    installUpdate,
  } = useUpdater();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (update || error) {
      setVisible(true);
    }
  }, [update, error]);

  useEffect(() => {
    checkForUpdate();
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <UpdateModal
      update={update}
      downloading={downloading}
      downloaded={downloaded}
      progress={progress}
      error={error}
      onDownload={downloadUpdate}
      onInstall={installUpdate}
      onClose={() => setVisible(false)}
    />
  );
}