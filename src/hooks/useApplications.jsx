import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getApplications } from "../lib/candidates/getApplications";

export default function useApplications({
  hotelId,
  positionId,
}) {
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadApplications = useCallback(async () => {
    if (!hotelId || !positionId) {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await getApplications({
      hotelId,
      positionId,
    });

    setApplications(result.data);
    setError(result.error);

    setLoading(false);
  }, [hotelId, positionId]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return {
    applications,
    loading,
    error,
    reload: loadApplications,
  };
}