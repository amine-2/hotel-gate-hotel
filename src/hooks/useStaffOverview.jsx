import { useCallback, useEffect, useState } from "react";
import { getStaffOverview } from "../lib/users/getStaffOverview";

export function useStaffOverview(hotelId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStaffOverview = useCallback(async () => {
    if (!hotelId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const result = await getStaffOverview(hotelId);

    setData(result.data);
    setError(result.error);

    setLoading(false);
  }, [hotelId]);

  useEffect(() => {
    loadStaffOverview();
  }, [loadStaffOverview]);

  return {
    data,
    loading,
    error,
    reload: loadStaffOverview,
  };
}