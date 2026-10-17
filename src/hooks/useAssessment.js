import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../config/api";

/** The learner's latest knowledge-check result (or null if they haven't taken it). */
export function useAssessment() {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch("api/assessment.php");
      if (res.success) setAssessment(res.assessment);
    } catch {
      /* dashboard still works without it */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { assessment, loading, reload: load };
}
