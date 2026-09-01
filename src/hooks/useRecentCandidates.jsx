import { useCallback, useEffect, useState } from "react";
import { getRecentCandidates } from "../lib/candidates/getRecentCandidates";

export function useRecentCandidates(hotelId, limit = 5) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCandidates = useCallback(async () => {
    if (!hotelId) {
      setCandidates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await getRecentCandidates(hotelId, limit);

    setCandidates(result.data);
    setError(result.error);

    setLoading(false);
  }, [hotelId, limit]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  return {
    candidates,
    loading,
    error,
    reload: loadCandidates,
  };
}