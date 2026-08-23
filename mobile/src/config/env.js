import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const API_BASE_URL = extra.apiBaseUrl ?? 'http://10.0.2.2:8000/api/v1';
export const GOOGLE_MAPS_API_KEY = extra.googleMapsApiKey ?? '';
