import { useCallback, useEffect, useState } from 'react';
import { cancelReservation, createReservation, getMyReservations } from '../services/reservations.service';

export function useReservationsViewModel() {
  const [active, setActive] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMyReservations();
      setActive(result?.active ?? []);
      setHistory(result?.history ?? []);
    } catch (e) {
      setError(e?.response?.data?.message ?? 'No se pudieron cargar tus pedidos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reserve = useCallback(async (packageId, quantity = 1) => {
    return createReservation(packageId, quantity);
  }, []);

  const cancel = useCallback(
    async (id) => {
      await cancelReservation(id);
      await load();
    },
    [load]
  );

  return { active, history, isLoading, error, reload: load, reserve, cancel };
}
