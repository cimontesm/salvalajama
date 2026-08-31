// La URL del backend vive en mobile/.env (NO se commitea).
// Expo SDK 54 expone las variables EXPO_PUBLIC_* vía process.env.
// Fallback: 10.0.2.2 = localhost del emulador Android.
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.0.2.2:8000/api/v1';
