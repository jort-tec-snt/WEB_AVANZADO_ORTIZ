# AeroGate · Laboratorio 13: Autenticación y seguridad con NextAuth.js

Portal de acceso en Next.js (App Router) con **Google OAuth**, **GitHub OAuth** y **credenciales propias**
(registro, bcrypt y bloqueo por intentos). Interfaz de estilo Frutiger Aero.

## Stack
Next.js 16 · NextAuth.js 4 (sesión JWT) · Prisma 7 + PostgreSQL (Supabase) · bcryptjs · Tailwind CSS 4 · pnpm

## Funcionalidad
| Requisito del laboratorio | Dónde está |
|---|---|
| Google OAuth | `src/lib/auth.ts` (`GoogleProvider`) |
| GitHub OAuth (tarea) | `src/lib/auth.ts` (`GitHubProvider`) |
| Login con credenciales (tarea) | `src/lib/auth.ts` (`CredentialsProvider`) |
| Formulario de registro (tarea) | `src/app/register/page.tsx` y `src/app/api/register/route.ts` |
| Cifrado con bcrypt (tarea) | 12 rondas, en el registro y en la verificación |
| Bloqueo tras varios intentos (tarea) | 5 fallos seguidos bloquean la cuenta 15 minutos (`MAX_ATTEMPTS`, `LOCK_MINUTES`) |
| Protección de rutas | `src/proxy.ts` + mapa en `src/lib/routes.ts` |

### Mapa de rutas
| Ruta | Sin sesión | Con sesión |
|---|---|---|
| `/dashboard`, `/profile` | redirige a `/signIn?callbackUrl=...` | acceso |
| `/signIn`, `/register` | acceso | redirige a `/dashboard` |
| `/api/register` | acceso | 403 |

### Diferencias respecto a la guía
- `authOptions` está en `src/lib/auth.ts`: un `route.ts` de Next.js solo puede exportar handlers HTTP.
- Next.js 16 renombró `middleware` a `proxy`, por eso el archivo es `src/proxy.ts`.
- El `callbackUrl` se valida para aceptar solo rutas internas (evita open redirect).

## Ejecución local
```bash
pnpm install
cp .env.example .env      # completar los valores
pnpm exec prisma db push  # crea la tabla User
pnpm dev
```

Variables (ver `.env.example`): `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_ID`,
`GITHUB_SECRET`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`.

URLs de callback: `<NEXTAUTH_URL>/api/auth/callback/google` y `<NEXTAUTH_URL>/api/auth/callback/github`.

## Estructura
- `src/lib`: `auth.ts` (opciones de NextAuth), `routes.ts` (mapa de rutas), `prisma.ts`.
- `src/components`: `Navbar`, `Field`, `LogoutButton`, `SessionProvider`.
- `src/styles`: `tokens.css`, `base.css`, `components.css`, `pages.css`.
- `public/aero`: imágenes del tema (WebP).

## Evidencias
Capturas en [`../capturas`](../capturas/).

### Interfaz y rutas protegidas
**Pantalla de acceso** (`/signIn`): credenciales, Google y GitHub.

![Pantalla de acceso](../capturas/01-signin.png)

**Dashboard** con la sesión iniciada: método de acceso, tipo de sesión y mapa de rutas.

![Dashboard](../capturas/04-dashboard-credenciales.png)

**Perfil** (`/profile`).

![Perfil](../capturas/05-profile-credenciales.png)

**Ruta protegida:** sin sesión, `/dashboard` redirige a `/signIn?callbackUrl=%2Fdashboard`.

![Ruta protegida](../capturas/14-ruta-protegida-redirige-signin.png)

**Ruta solo para invitados:** con sesión activa, `/signIn` redirige a `/dashboard`. La etiqueta inferior muestra la URL final, porque la captura se tomó en modo headless.

![Ruta de invitados](../capturas/15-ruta-invitados-redirige-dashboard.png)

### Credenciales: registro, errores y bloqueo
**Formulario de registro** (`/register`), vacío y con datos.

![Registro](../capturas/02-register.png)
![Registro con datos](../capturas/03-registro-nueva-cuenta.png)

**Contraseña incorrecta:** el mensaje indica los intentos restantes.

![Error de credenciales](../capturas/06-error-credenciales.png)

**Bloqueo:** tras 5 intentos fallidos la cuenta se bloquea 15 minutos, incluso con la contraseña correcta.

![Cuenta bloqueada](../capturas/07-cuenta-bloqueada.png)

### Vista móvil
<img src="../capturas/17-movil-signin.png" alt="Acceso en móvil" width="260"> <img src="../capturas/18-movil-dashboard.png" alt="Dashboard en móvil" width="260">

## Entrega
- Repositorio: _pendiente_
- Despliegue en Vercel: _pendiente_
