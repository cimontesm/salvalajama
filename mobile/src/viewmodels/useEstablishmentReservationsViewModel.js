import { useCallback, useEffect, useState } from 'react';
import * as reservationService from '../services/reservations.service';

export function useEstablishmentReservationsViewModel() {
  const [data, setData] = useState({ pending: [], history: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true); setError(null);
    try { setData(await reservationService.getEstablishmentReservations()); }
    catch (e) { setError(e?.response?.data?.message ?? 'No se pudieron cargar los pedidos.'); }
    finally { setIsLoading(false); }
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    const updated = await reservationService.updateReservationStatus(id, status);
    await reload();
    return updated;
  }, [reload]);

  useEffect(() => { reload(); }, [reload]);
  return { ...data, isLoading, error, reload, updateStatus };
}
