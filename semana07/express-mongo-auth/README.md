# Lab 07 - Autenticación y Seguridad con Express, MongoDB y JWT

Proyecto desarrollado para el laboratorio de **Desarrollo de Aplicaciones Web Avanzado - Semana 07**, enfocado en autenticación con JWT, autorización por roles, persistencia con MongoDB y una interfaz web construida con EJS y Materialize.

Repositorio:

```text
https://github.com/jort-tec-snt/lab07-auth-security
```

## Objetivo

Implementar una aplicación web con Node.js y Express que permita:

- Registrar usuarios.
- Iniciar sesión mediante correo y contraseña.
- Cifrar contraseñas con bcrypt.
- Generar y verificar tokens JWT.
- Proteger endpoints mediante autenticación.
- Aplicar autorización basada en roles `user` y `admin`.
- Consultar y editar el perfil del usuario autenticado.
- Listar usuarios desde un dashboard administrativo.
- Renderizar interfaces con EJS y Materialize.
- Mostrar páginas 403 y 404.
- Evitar la exposición de credenciales, hashes y secretos.

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt
- dotenv
- CORS
- EJS
- Materialize CSS
- Nodemon
- Docker

---

## Arquitectura del proyecto

El proyecto fue organizado por capas para separar las responsabilidades de acceso a datos, lógica de negocio, controladores, seguridad y presentación.

```text
express-mongo-auth/
│
├── node_modules/
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── auth.js
│
├── src/
│   ├── controllers/
│   │   ├── AuthController.js
│   │   └── UserController.js
│   │
│   ├── middlewares/
│   │   ├── authenticate.js
│   │   └── authorize.js
│   │
│   ├── models/
│   │   ├── Role.js
│   │   └── User.js
│   │
│   ├── repositories/
│   │   ├── RoleRepository.js
│   │   └── UserRepository.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   └── web.routes.js
│   │
│   ├── services/
│   │   ├── AuthService.js
│   │   └── UserService.js
│   │
│   ├── utils/
│   │   ├── seedRoles.js
│   │   └── seedUsers.js
│   │
│   ├── views/
│   │   ├── admin/
│   │   │   └── dashboard.ejs
│   │   ├── auth/
│   │   │   ├── signin.ejs
│   │   │   └── signup.ejs
│   │   ├── errors/
│   │   │   ├── 403.ejs
│   │   │   └── 404.ejs
│   │   ├── partials/
│   │   │   ├── head.ejs
│   │   │   └── footer.ejs
│   │   └── user/
│   │       ├── dashboard.ejs
│   │       └── profile.ejs
│   │
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Flujo de la aplicación

```text
Cliente
  │
  ▼
Routes
  │
  ▼
Middlewares
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
Repositories
  │
  ▼
Models
  │
  ▼
MongoDB
```

La autenticación utiliza JWT y las rutas protegidas verifican primero la identidad del usuario y luego sus permisos.

---

## Modelo de usuario

El modelo `User` incluye los siguientes campos:

- `name`
- `lastName`
- `phoneNumber`
- `birthdate`
- `email`
- `password`
- `roles`
- `url_profile`
- `address`
- `createdAt`
- `updatedAt`

La edad se calcula mediante un campo virtual `age`, por lo que no se almacena físicamente en MongoDB.

### Política de contraseña

La contraseña debe cumplir con:

- Mínimo 8 caracteres.
- Al menos una letra mayúscula.
- Al menos un dígito.
- Al menos uno de los siguientes caracteres especiales:

```text
# $ % & * @
```

La validación se realiza antes de generar el hash con bcrypt.

---

## Roles

El sistema utiliza dos roles:

```text
user
admin
```

### user

Puede:

- Iniciar sesión.
- Consultar su dashboard.
- Consultar su perfil.
- Editar los campos permitidos de su perfil.

### admin

Puede realizar todo lo anterior y además:

- Acceder al dashboard administrativo.
- Consultar la lista completa de usuarios.

---

## Seguridad implementada

### Hash de contraseñas

Las contraseñas se almacenan utilizando `bcrypt`.

El password original nunca se guarda en MongoDB.

### JWT

Al iniciar sesión correctamente se genera un token JWT con información similar a:

```json
{
  "sub": "ID_DEL_USUARIO",
  "roles": ["user"]
}
```

El secreto utilizado para firmar los tokens se obtiene desde variables de entorno.

### Middleware de autenticación

`authenticate.js`:

- Lee el header `Authorization`.
- Requiere el formato `Bearer <token>`.
- Verifica el JWT.
- Guarda el identificador y roles en:

```text
req.userId
req.userRoles
```

### Middleware de autorización

`authorize.js` controla el acceso a los recursos en función de los roles.

Ejemplo:

```javascript
authorize(['admin'])
```

Solo permite usuarios con rol administrador.

### Protección contra escalación de privilegios

El endpoint público de registro no acepta roles enviados por el cliente.

Todo usuario registrado mediante `/api/auth/signUp` recibe obligatoriamente:

```text
user
```

El administrador se crea internamente mediante `seedUsers.js`.

### Protección de información sensible

Las respuestas de la API no incluyen:

- `password`
- hashes bcrypt
- `JWT_SECRET`
- credenciales administrativas
- `__v`

Además, `.env` y `node_modules` se encuentran ignorados por Git.

---

## Variables de entorno

Crear un archivo `.env` tomando como referencia `.env.example`.

Ejemplo:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auth_db

JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=1h

BCRYPT_SALT_ROUNDS=10

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_secure_password
ADMIN_NAME=Administrador
ADMIN_LAST_NAME=Sistema
ADMIN_PHONE_NUMBER=999999999
ADMIN_BIRTHDATE=2000-01-01
```

> Nunca subir el archivo `.env` al repositorio.

---

## MongoDB con Docker

Para ejecutar MongoDB localmente:

```bash
docker run -d \
  --name lab07-mongodb \
  -p 127.0.0.1:27017:27017 \
  -v lab07_mongo_data:/data/db \
  mongo:8.0
```

Verificar el contenedor:

```bash
docker ps --filter name=lab07-mongodb
```

La base de datos utilizada es:

```text
auth_db
```

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/jort-tec-snt/lab07-auth-security.git
```

Ingresar al proyecto:

```bash
cd lab07-auth-security
```

Instalar las dependencias:

```bash
npm install
```

Crear `.env`:

```bash
cp .env.example .env
```

Editar las variables locales:

```bash
nano .env
```

---

## Ejecución

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Al iniciar correctamente:

```text
Mongo connected
Servidor corriendo en el puerto 3000
```

---

## Endpoint de salud

```http
GET /health
```

Respuesta esperada:

```json
{
  "ok": true
}
```

---

## Endpoints de autenticación

### Registro

```http
POST /api/auth/signUp
```

Ejemplo:

```json
{
  "name": "Usuario",
  "lastName": "Laboratorio",
  "phoneNumber": "999999999",
  "birthdate": "2000-05-10",
  "email": "user@example.com",
  "password": "Lab07#123"
}
```

### Inicio de sesión

```http
POST /api/auth/signIn
```

Ejemplo:

```json
{
  "email": "user@example.com",
  "password": "Lab07#123"
}
```

Si las credenciales son correctas se devuelve un JWT.

---

## Endpoints protegidos

### Perfil actual

```http
GET /api/users/me
```

Requiere:

```text
Authorization: Bearer <JWT>
```

### Actualizar perfil

```http
PUT /api/users/me
```

Campos permitidos:

- `name`
- `lastName`
- `phoneNumber`
- `birthdate`
- `url_profile`
- `address`

No se permite modificar mediante esta ruta:

- `email`
- `password`
- `roles`

### Listar usuarios

```http
GET /api/users
```

Requiere rol:

```text
admin
```

---

## Rutas web

```text
/signIn
/signUp
/user/dashboard
/profile
/admin/dashboard
/403
```

Las rutas inexistentes muestran una página personalizada 404.

---

## Interfaz web

La interfaz fue desarrollada utilizando:

- EJS
- Materialize CSS
- JavaScript
- `fetch`
- `sessionStorage`

El JWT del cliente se almacena en:

```javascript
sessionStorage
```

y se utiliza para consumir los endpoints protegidos.

Al cerrar sesión:

```javascript
sessionStorage.removeItem('token');
```

---

## Páginas principales

### SignIn

Permite iniciar sesión mediante correo y contraseña.

### SignUp

Permite registrar un nuevo usuario con validación de contraseña.

### Dashboard de usuario

Muestra información del usuario autenticado.

### Perfil

Permite visualizar y actualizar los campos autorizados.

### Dashboard administrativo

Permite listar usuarios registrados únicamente cuando el JWT contiene el rol `admin`.

### 403

Se muestra cuando un usuario autenticado intenta ingresar a una sección para la cual no posee permisos.

### 404

Se muestra al solicitar una ruta web inexistente.

---

## Seeds

### seedRoles.js

Garantiza la existencia de:

```text
user
admin
```

### seedUsers.js

Crea el usuario administrador utilizando exclusivamente variables de entorno.

El proceso es idempotente y evita generar administradores duplicados.

---

## Consultas de verificación en MongoDB

Ingresar a MongoDB:

```bash
docker exec -it lab07-mongodb mongosh
```

Seleccionar la base:

```javascript
use auth_db
```

Consultar roles:

```javascript
db.roles.find({}, { name: 1 }).pretty()
```

Consultar usuarios sin exponer hashes:

```javascript
db.users.find({}, { password: 0 }).pretty()
```

---

## Pruebas realizadas

Durante el desarrollo se verificó:

- Conexión Express - MongoDB.
- Creación automática de roles.
- Creación segura del administrador.
- Registro de usuarios.
- Rechazo de contraseñas débiles.
- Hash de contraseñas con bcrypt.
- Inicio de sesión.
- Generación y validación de JWT.
- Acceso a `/api/users/me`.
- Rechazo de usuarios sin token.
- Respuesta `403` cuando un usuario normal accede a recursos administrativos.
- Acceso correcto del administrador.
- Protección contra envío de `roles: ["admin"]` durante el registro.
- Exclusión de hashes de contraseña en las respuestas.
- Cálculo dinámico de edad.
- Actualización segura del perfil.
- Navegación entre interfaces EJS.
- Páginas personalizadas 403 y 404.

---


## Autor

**Ortiz**

Desarrollo de Aplicaciones Web Avanzado - Semana 07
