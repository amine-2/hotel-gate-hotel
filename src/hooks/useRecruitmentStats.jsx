import { useCallback, useEffect, useState } from "react";
import { getRecruitmentStats } from "../lib/candidates/getRecruitmentStats";

export function useRecruitmentStats(hotelId) {
  const [stats, setStats] = useState({
    new: 0,
    reviewing: 0,
    interview: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    if (!hotelId) {
      setStats({
        new: 0,
        reviewing: 0,
        interview: 0,
      });

      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await getRecruitmentStats(hotelId);

    setStats(result.data);
    setError(result.error);

    setLoading(false);
  }, [hotelId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    reload: loadStats,
  };
}