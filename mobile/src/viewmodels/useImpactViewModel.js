import { useCallback, useEffect, useState } from 'react';
import { getImpact } from '../services/impact.service';

export function useImpactViewModel() {
  const [impact, setImpact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const reload = useCallback(async () => {
    setIsLoading(true); setError(null);
    try { setImpact(await getImpact()); }
    catch (e) { setError(e?.response?.data?.message ?? 'No se pudieron cargar los indicadores.'); }
    finally { setIsLoading(false); }
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return { impact, isLoading, error, reload };
}
