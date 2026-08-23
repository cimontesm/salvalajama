import { useCallback, useEffect, useState } from 'react';
import { getPackages } from '../services/packages.service';

const CATEGORIES = ['panadería', 'supermercado', 'restaurante', 'cafetería'];

export function useOffersViewModel() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const filters = { available: true };
      if (search) filters.q = search;
      if (category) filters.category = category;
      if (maxPrice) filters.max_price = maxPrice;
      const result = await getPackages(filters);
      setPackages(result?.data ?? result ?? []);
    } catch (e) {
      setError(e?.response?.data?.message ?? 'No se pudieron cargar las ofertas.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [search, category, maxPrice]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    load({ silent: true });
  }, [load]);

  return {
    packages,
    isLoading,
    isRefreshing,
    error,
    search,
    setSearch,
    category,
    setCategory,
    categories: CATEGORIES,
    maxPrice,
    setMaxPrice,
    refresh,
    reload: load,
  };
}
