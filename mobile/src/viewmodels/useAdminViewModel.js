import { useCallback, useEffect, useState } from 'react';
import * as adminService from '../services/admin.service';

export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setUsers(await adminService.getUsers());
    } catch (e) {
      setError(e?.response?.data?.message ?? 'No se pudieron cargar los usuarios.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const create = useCallback(async (payload) => {
    await adminService.createUser(payload);
    await reload();
  }, [reload]);

  const update = useCallback(async (id, payload) => {
    await adminService.updateUser(id, payload);
    await reload();
  }, [reload]);

  const setStatus = useCallback(async (id, status) => {
    await adminService.updateUserStatus(id, status);
    await reload();
  }, [reload]);

  const remove = useCallback(async (id) => {
    await adminService.deleteUser(id);
    await reload();
  }, [reload]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { users, isLoading, error, reload, create, update, setStatus, remove };
}

export function useAdminEstablishments() {
  const [establishments, setEstablishments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setEstablishments(await adminService.getAdminEstablishments());
    } catch (e) {
      setError(e?.response?.data?.message ?? 'No se pudieron cargar los establecimientos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const create = useCallback(async (payload) => {
    await adminService.createEstablishment(payload);
    await reload();
  }, [reload]);

  const update = useCallback(async (id, payload) => {
    await adminService.updateEstablishment(id, payload);
    await reload();
  }, [reload]);

  const setStatus = useCallback(async (id, status) => {
    await adminService.updateEstablishmentStatus(id, status);
    await reload();
  }, [reload]);

  const remove = useCallback(async (id) => {
    await adminService.deleteEstablishment(id);
    await reload();
  }, [reload]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { establishments, isLoading, error, reload, create, update, setStatus, remove };
}

export function useAdminPackages() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setPackages(await adminService.getAdminPackages());
    } catch (e) {
      setError(e?.response?.data?.message ?? 'No se pudieron cargar las publicaciones.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { packages, isLoading, error, reload };
}

export function useAdminMonitoring() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setStats(await adminService.getMonitoring());
    } catch (e) {
      setError(e?.response?.data?.message ?? 'No se pudieron cargar las métricas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { stats, isLoading, error, reload };
}
