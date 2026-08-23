# Salva la Jama — Mobile (Expo / React Native)

App Android del proyecto **Salva la Jama** (ver `/CLAUDE.md` en la raíz del repo). Generado
con `create-expo-app` (template blank) + las dependencias exactas de CLAUDE.md 6.1, con la
estructura de carpetas MVVM de la sección 6.2.

## Puesta en marcha

```bash
cd mobile
npm install
npx expo start
```

Con el emulador Android abierto, presiona `a` en la terminal de Expo (o `npm run android`).

## Configuración pendiente antes de usar ciertas features

- `app.json` → `expo.extra.googleMapsApiKey` y `expo.android.config.googleMaps.apiKey`:
  agrega tu `GOOGLE_MAPS_API_KEY` para que `react-native-maps` funcione.
- `app.json` → `expo.android.googleServicesFile`: coloca tu `google-services.json`
  (Firebase) en `mobile/google-services.json` para que FCM funcione.
- **FCM no funciona en Expo Go.** Requiere un development build:
  `eas build --profile development --platform android` (ver CLAUDE.md 6.1 y 10).
- La URL de la API (`expo.extra.apiBaseUrl` en `app.json`) ya apunta a
  `http://10.0.2.2:8000/api/v1` (localhost del backend visto desde el emulador Android).
  Cámbiala si usas un dispositivo físico (IP de tu PC en la red local).

## Qué incluye este Sprint 0

- Proyecto Expo (SDK actual) + dependencias reales instaladas y fijadas en `package.json`:
  navegación (`@react-navigation/*`), `axios`, `react-hook-form` + `zod`,
  `@react-native-async-storage/async-storage`, `react-native-maps`, `expo-image-picker`,
  `@react-native-firebase/{app,messaging}`.
- `src/api/client.js`: axios con interceptor que inyecta el token JWT y limpia la sesión
  ante un 401.
- `src/store/AuthContext.js` + `src/viewmodels/useAuthViewModel.js`: sesión, login,
  register, logout, restauración de sesión con AsyncStorage.
- `src/navigation/RootNavigator.js`: decide el flujo según `role` (cliente / establecimiento
  / administrador), con `AuthStack` (Login/Register) cuando no hay sesión.
- Tabs por rol (`ClientTabs`, `EstablishmentTabs`, `AdminTabs`) con las pantallas de
  CLAUDE.md 6.3, como placeholders listos para que cada sprint las reemplace.
- `LoginScreen` y `RegisterScreen` funcionales end-to-end contra el backend (`/auth/login`,
  `/auth/register`).
- `PerfilScreen` compartida por los tres roles, con cierre de sesión funcional.

## Qué falta (siguientes sprints — ver CLAUDE.md sección 7)

Las pantallas reales de catálogo, reservas, publicaciones, pedidos, reportes, reseñas,
notificaciones, impacto y administración quedan para los Sprints 1-5, según el reparto de
la sección 1. Los archivos `src/services/*.service.js` (excepto `auth.service.js`) están
como stub, listos para que cada quien agregue sus llamadas a la API.

## Verificación rápida

Con el backend corriendo (`php artisan serve`) y sembrado (`php artisan migrate:fresh --seed`):

1. `npx expo start` → abrir en el emulador Android.
2. Iniciar sesión con `ana@demo.ec` / `password` → debe entrar a `ClientTabs`.
3. Cerrar sesión desde Perfil → debe volver a `AuthStack`.
4. Probar registro de una cuenta nueva con rol `establecimiento` → debe entrar a
   `EstablishmentTabs`.
