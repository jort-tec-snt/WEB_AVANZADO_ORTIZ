# express-mongo-auth

API REST con Express + MongoDB Atlas (Mongoose) + JWT y roles. Laboratorio 08 – DAWA.

## Endpoints
| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/auth/register` | Público (`name`, `email`, `password`, `role` opcional) |
| POST | `/api/auth/login` | Público → devuelve `token` |
| GET | `/api/auth/profile` | Bearer token |
| GET | `/api/users` | Bearer token + rol `admin` |
| GET | `/api/users/:id` | Bearer token |
| PUT/DELETE | `/api/users/:id` | Bearer token + rol `admin` |

## Local
```bash
pnpm install
cp .env.example .env   # completa MONGO_URI y JWT_SECRET
pnpm dev
```

## Despliegue (Render + GitHub Actions)
- Build Command: `pnpm install` · Start Command: `pnpm start`
- Variables en Render: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`
- Secret en GitHub: `RENDER_DEPLOY_HOOK_URL`
- Workflow: `.github/workflows/deploy.yml` (push a `main` → dispara el Deploy Hook)
