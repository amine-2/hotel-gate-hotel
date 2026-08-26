import { useCallback, useEffect, useState } from "react";
import { getHRStats } from "../lib/users/getHRStats";

export function useHRStats(hotelId) {
  const [stats, setStats] = useState({
    totalStaff: 0,
    active: 0,
    onLeave: 0,
    candidates: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    if (!hotelId) {
      setStats({
        totalStaff: 0,
        active: 0,
        onLeave: 0,
        candidates: 0,
      });

      setLoading(false);
      return;
    }

    setLoading(true);

    const result = await getHRStats(hotelId);

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