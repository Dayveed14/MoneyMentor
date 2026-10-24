import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../config/api";

/** The learner's latest knowledge-check result (or null) and every result, oldest first. */
export function useAssessment() {
  const [assessment, setAssessment] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch("api/assessment.php");
      if (res.success) {
        setAssessment(res.assessment);
        setHistory(res.history || []);
      }
    } catch {
      /* dashboard still works without it */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { assessment, history, loading, reload: load };
}
