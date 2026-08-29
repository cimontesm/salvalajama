import { useState, useCallback } from 'react';
import { useAuth } from '../store/AuthContext';

// ViewModel para Login/Register/Perfil.
export function useAuthViewModel() {
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitLogin = useCallback(
    async (email, password) => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await auth.login(email, password);
      } catch (e) {
        setError(e?.response?.data?.message ?? 'No se pudo iniciar sesión.');
        throw e;
      } finally {
        setIsSubmitting(false);
      }
    },
    [auth]
  );

  const submitRegister = useCallback(
    async (payload) => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await auth.register(payload);
      } catch (e) {
        setError(e?.response?.data?.message ?? 'No se pudo crear la cuenta.');
        throw e;
      } finally {
        setIsSubmitting(false);
      }
    },
    [auth]
  );

  return {
    user: auth.user,
    role: auth.role,
    isAuthenticated: auth.isAuthenticated,
    isSubmitting,
    error,
    submitLogin,
    submitRegister,
    logout: auth.logout,
  };
}
