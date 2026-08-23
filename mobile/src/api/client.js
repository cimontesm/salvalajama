import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/env';

export const TOKEN_STORAGE_KEY = '@salvalajama/token';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

// Inyecta el token JWT en cada request (Authorization: Bearer <token>).
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Callback opcional que AuthContext registra para reaccionar a un 401
// (token vencido/ inválido) cerrando la sesión localmente.
let onUnauthorized = null;
export function setOnUnauthorized(handler) {
  onUnauthorized = handler;
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      if (onUnauthorized) onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default client;
