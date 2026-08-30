import { useCallback, useEffect, useState } from "react";

import { getPositions } from "../lib/candidates/getPositions";

export default function usePositions(hotelId) {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPositions = useCallback(async () => {
    if (!hotelId) {
      setPositions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await getPositions(hotelId);

    setPositions(result.data);
    setError(result.error);

    setLoading(false);
  }, [hotelId]);

  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  return {
    positions,
    loading,
    error,
    reload: loadPositions,
  };
}