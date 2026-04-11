import { useState, useCallback, useEffect } from "react";
import type { AnalyticsSummary } from "@/types/analytics";
import { APP_ROUTES } from "@/constants/routes";

export function useAnalytics() {
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(APP_ROUTES.api.admin.analytics.summary);
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    stats,
    loading,
    refreshAnalytics: fetchAnalytics,
  };
}
