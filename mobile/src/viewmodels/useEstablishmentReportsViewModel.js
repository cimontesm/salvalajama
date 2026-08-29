import { useCallback, useEffect, useState } from 'react';
import { getMyReports } from '../services/reports.service';

export function useEstablishmentReportsViewModel() {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setReport(await getMyReports());
    } catch (e) {
      setError(e?.response?.data?.message ?? 'No se pudieron cargar los reportes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { report, isLoading, error, reload };
}
