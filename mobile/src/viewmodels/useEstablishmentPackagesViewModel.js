import { useCallback, useEffect, useState } from 'react';
import * as packagesService from '../services/packages.service';

export function useEstablishmentPackagesViewModel() {
  const [data, setData] = useState({ active: [], expired: [], history: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true); setError(null);
    try { setData(await packagesService.getMyPackages()); }
    catch (e) { setError(e?.response?.data?.message ?? 'No se pudieron cargar las publicaciones.'); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { reload(); }, [reload]);
  return { ...data, isLoading, error, reload };
}
