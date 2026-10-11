## Evidencias

API desplegada en Render: https://web-avanzado-ortiz.onrender.com

### Thunder Client (API en la nube)
| N.º | Prueba | Resultado | Captura |
|---|---|---|---|
| 01 | `POST /api/auth/signIn` (admin) | 200 + token | _pendiente_ `img/01-signin-admin-200.png` |
| 02 | `GET /api/users/me` con token de admin | 200 | _pendiente_ `img/02-me-admin-200.png` |
| 03 | `GET /api/users/me` sin token | 401 | ![03](img/03-me-sin-token-401.png) |
| 04 | `GET /api/users` con token de admin | 200 | _pendiente_ `img/04-users-admin-200.png` |
| 05 | `POST /api/auth/signUp` (usuario) | 201 | ![05](img/05-signup-usuario-201.png) |
| 06 | `POST /api/auth/signIn` (usuario) | 200 + token | ![06](img/06-signin-usuario-200.png) |
| 07 | `GET /api/users` con token de usuario | 403 | ![07](img/07-users-usuario-403.png) |

Extra: `GET /api/users/me` con token de usuario → 200 ![02b](img/02b-me-usuario-200.png)

### Navegador
| N.º | Vista | Captura |
|---|---|---|
| 08 | `/health` → `{"ok":true}` | ![08](img/08-render-health.png) |
| 09 | `/signIn` | ![09](img/09-render-signin-web.png) |
| 10 | Dashboard del admin | _pendiente_ `img/10-render-admin-dashboard.png` |

### GitHub Actions y Render
| N.º | Evidencia | Captura |
|---|---|---|
| 11 | Lista de runs, #3 en verde | _pendiente_ `img/11-actions-workflow-verde.png` |
| 12 | Run en detalle, paso "Trigger Render deploy" | _pendiente_ `img/12-actions-run-detalle.png` |
| 13 | Render › Events, deploy por hook en Live | _pendiente_ `img/13-render-deploy-hook-live.png` |
| 14 | Render › Environment (valores tapados) | _pendiente_ `img/14-render-environment.png` |

### MongoDB Atlas
| N.º | Evidencia | Captura |
|---|---|---|
| 15 | `lab07_auth_db` › `users` | _pendiente_ `img/15-atlas-coleccion-users.png` |
| 16 | `lab07_auth_db` › `roles` | _pendiente_ `img/16-atlas-coleccion-roles.png` |

### Anexo: pruebas locales previas (Thunder Client, MongoDB Atlas)
| N.º | Prueba | Resultado | Captura |
|---|---|---|---|
| L1 | Registro de admin | 201 + token | ![L1](img/local-01-signup-admin-201.png) |
| L2 | Registro de usuario | 201 | ![L2](img/local-02-signup-usuario-201.png) |
| L3 | Login de usuario | 200 + token | ![L3](img/local-03-signin-usuario-200.png) |
| L4 | `GET /api/auth/profile` sin token | 401 | ![L4](img/local-04-profile-sin-token-401.png) |
| L5 | `GET /api/auth/profile` con token | 200 | ![L5](img/local-05-profile-con-token-200.png) |
| L6 | `GET /api/users` con token de usuario | 403 | ![L6](img/local-06-users-usuario-403.png) |
| L7 | `GET /api/users` con token de admin | 200 | ![L7](img/local-07-users-admin-200.png) |
