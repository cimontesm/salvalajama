# Salva la Jama — Backend (Laravel API)

API REST del proyecto **Salva la Jama** (ver `/CLAUDE.md` en la raíz del repo para el
contrato completo). Generado a mano (sin `composer create-project`, por restricciones de
red del entorno donde se generó) siguiendo la estructura estándar de Laravel 11.

## Puesta en marcha

```bash
cd backend
composer install
copy .env.example .env      # (Windows)  |  cp .env.example .env   (macOS/Linux)
php artisan key:generate
php artisan jwt:secret
```

Configura tu base de datos MySQL en `.env` (`DB_DATABASE=salva_la_jama`, usuario y
contraseña de tu MySQL local), luego:

```bash
php artisan migrate:fresh --seed
php artisan serve
```

La API queda disponible en `http://localhost:8000/api/v1`. Desde el emulador Android usa
`http://10.0.2.2:8000/api/v1` (ver CLAUDE.md sección 6.1).

## Qué incluye este Sprint 0

- Proyecto Laravel 11 (estructura `bootstrap/app.php`, sin Kernel.php) — **API-only**, sin
  Vite/Blade.
- Autenticación JWT con `php-open-source-saver/jwt-auth`, guard `api` configurado en
  `config/auth.php`.
- `AuthController` con `register`, `login`, `logout`, `refresh`, `me`, `profile` —
  contrato en `routes/api.php`.
- Modelos + migraciones para las 8 tablas del esquema (`users`, `establishments`,
  `packages`, `reservations`, `reviews`, `device_tokens`, `notifications` + las de sistema).
- Middleware `role:` para autorizar por rol (`cliente`, `establecimiento`, `administrador`).
- Seeder con los datos demo exactos de CLAUDE.md 5.7 (Ana Salazar, admin, 3 establecimientos,
  6 paquetes, reserva `SLJ-4902` activa + 2 retiradas con reseña). Contraseña demo: `password`.

## Qué falta (siguientes sprints, por integrante — ver CLAUDE.md sección 7)

Los endpoints de `establishments`, `packages`, `reservations`, `reviews`, `notifications`,
`admin` e `impact` (tabla completa en CLAUDE.md 5.5) todavía no están implementados —
quedan para los Sprints 1-5 según el reparto de la sección 1.

## Verificación rápida

```bash
php artisan route:list --path=api
curl -X POST http://localhost:8000/api/v1/auth/login -H "Content-Type: application/json" \
  -d '{"email":"ana@demo.ec","password":"password"}'
```
