import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

// La URL del backend y las llaves viven en mobile/.env (NO se commitea).
// Expo SDK 54 expone las variables EXPO_PUBLIC_* vía process.env.
// Fallback: 10.0.2.2 = localhost del emulador Android.
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.0.2.2:8000/api/v1';

export const GOOGLE_MAPS_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? extra.googleMapsApiKey ?? '';
