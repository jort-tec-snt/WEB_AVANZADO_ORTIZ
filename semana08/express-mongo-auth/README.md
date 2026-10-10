## Evidencias

Pruebas con **Thunder Client** (VS Code) contra la API en local, conectada a MongoDB Atlas.

### Autenticación
| Prueba | Resultado esperado | Captura |
|---|---|---|
| Registro de admin | 201 + token | ![Registro admin](img/api-auth-register-admin.png) |
| Registro de usuario | 201 | ![Registro usuario](img/api-auth-register-user.png) |
| Login de usuario | 200 + token | ![Login usuario](img/api-auth-login-user.png) |

### Rutas protegidas y roles
| Prueba | Resultado esperado | Captura |
|---|---|---|
| `GET /api/auth/profile` sin token | 401 | ![Profile sin token](img/api-auth-profile-user-sintokens-unauthorized-401.png) |
| `GET /api/auth/profile` con token | 200 | ![Profile con token](img/api-auth-profile-user-tokens-autorized.png) |
| `GET /api/users` con token de usuario | 403 | ![Users 403](img/api-users-tokens-user-forbidden-403.png) |
| `GET /api/users` con token de admin | 200 | ![Users admin](img/api-users-tokens-admin.png) |

### Base de datos en la nube
_pendiente: captura de la colección `users` en MongoDB Atlas_

### Despliegue (Render + GitHub Actions)
- API en la nube: _pendiente_
- Pipeline en verde: _pendiente_