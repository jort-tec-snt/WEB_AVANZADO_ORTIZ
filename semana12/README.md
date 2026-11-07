# Semana 12: API Routes con Next.js, Prisma y Supabase

Laboratorio 12 de Desarrollo de Aplicaciones Web Avanzado (DAWA), Tecsup. Proyecto en [`next-api-routes/`](next-api-routes/).

Stack: Next.js 16 (App Router), Prisma 7, PostgreSQL en Supabase y pnpm.

## Objetivo

Construir una API REST con las API Routes de Next.js (App Router) que persiste datos en PostgreSQL mediante Prisma, y consumirla desde una interfaz propia. El dominio es un sistema de biblioteca: autores y libros.

## Modelo de datos

Dos modelos con relación uno a muchos (un autor tiene varios libros), definidos en `prisma/schema.prisma`.

| Modelo | Campos principales | Restricciones |
|---|---|---|
| `Author` | `id`, `name`, `email`, `bio`, `nationality`, `birthYear`, `imageUrl` | `email` único |
| `Book` | `id`, `title`, `description`, `isbn`, `publishedYear`, `genre`, `pages`, `authorId` | `isbn` único; al borrar un autor se borran sus libros (`onDelete: Cascade`); índices en `authorId`, `genre` y `title` |

En Prisma 7 la URL de conexión no va en el esquema sino en `prisma.config.ts`, y el cliente usa el adaptador `pg`. La cadena de conexión se lee de la variable `DATABASE_URL`, que nunca se versiona (el repositorio solo incluye `.env.example`).

## Endpoints

| Método y ruta | Función |
|---|---|
| `GET /api/authors` | Lista autores con su cantidad de libros |
| `POST /api/authors` | Crea un autor (201) |
| `GET /api/authors/[id]` | Obtiene un autor |
| `PUT /api/authors/[id]` | Actualiza un autor |
| `DELETE /api/authors/[id]` | Elimina un autor y sus libros |
| `GET /api/authors/[id]/books` | Libros de un autor |
| `GET /api/authors/[id]/stats` | Estadísticas del autor: total de libros, primer y último libro, promedio de páginas, géneros, libro más largo y más corto |
| `GET /api/books` | Lista libros; admite `?genre=` |
| `POST /api/books` | Crea un libro asociado a un autor (201) |
| `GET /api/books/[id]` | Obtiene un libro con su autor |
| `PUT /api/books/[id]` | Actualiza un libro |
| `DELETE /api/books/[id]` | Elimina un libro |
| `GET /api/books/search` | Búsqueda por título (sin distinguir mayúsculas), filtros por género y autor, orden (`sortBy`, `order`) y paginación (`page`, `limit`, tope de 50) |
| `GET /api/stats` | Cifras generales para el dashboard |

Los errores se devuelven como `{ "error": "..." }` con el código adecuado: 404 si el registro no existe, 409 si se viola una restricción única (email o ISBN) y 400 si el autor indicado no existe. La traducción de los códigos de Prisma (`P2002`, `P2025`, `P2003`) está centralizada en `src/lib/http.ts`.

## Interfaz

Tres pantallas que consumen la API con `fetch`:

- **Dashboard (`/`):** estadísticas generales y galería de autores, con crear, editar y eliminar.
- **Libros (`/books`):** búsqueda en vivo con retardo de 300 ms, filtros por género y autor, orden, paginación y formularios en diálogos. Es responsive.
- **Ficha del autor (`/authors/[id]`):** datos, estadísticas, sus libros y alta de libros con el autor ya fijado.

Los estilos están separados en `src/styles/` (`tokens.css`, `base.css`, `components.css`, `pages.css`) y los componentes reutilizables en `src/components/`.

## Cómo ejecutarlo

```bash
cd semana12/next-api-routes
cp .env.example .env      # completar DATABASE_URL (Session pooler de Supabase)
pnpm install
pnpm exec prisma db push  # crea las tablas
pnpm dev                  # http://localhost:3000
```

`scripts/probar-api.sh` ejecuta con `curl` las pruebas de los endpoints, en el mismo orden de las evidencias.

## Evidencias

### Base de datos

Proyecto en Supabase (identificador y claves ocultos).

![Proyecto en Supabase](capturas/00-supabase-connect.png)

Conexión a Supabase (Session pooler) desde DBeaver.

![Conexión a la base de datos](capturas/00a-dbeaver-conexion.png)

Tablas `Author` y `Book` y su relación.

![Tablas Author y Book](capturas/00b-dbeaver-tablas.png)

Tabla `Book` con registros en el Table Editor de Supabase.

![Tabla Book en Supabase](capturas/00c-supabase-tablas.png)

### Vista móvil (390 px de ancho)

| Dashboard | Galería de autores |
|---|---|
| ![Dashboard en móvil](capturas/13a-movil-dashboard.png) | ![Galería en móvil](capturas/13b-movil-galeria.png) |

| Libros: filtros | Libros: lista |
|---|---|
| ![Filtros en móvil](capturas/13c-movil-libros-filtros.png) | ![Lista de libros en móvil](capturas/13d-movil-libros-lista.png) |

| Ficha del autor |
|---|
| ![Ficha del autor en móvil](capturas/13e-movil-ficha-autor.png) |

### Pruebas de la API

#### 1. `GET /api/authors`: listar autores

![GET /api/authors](capturas/01-get-authors.png)

#### 2. `POST /api/authors`: crear autor

![POST /api/authors](capturas/02-post-authors.png)

#### 3. `GET /api/authors/[id]`: autor por ID

![GET /api/authors/id](capturas/03-get-authors-id.png)

#### 4. `PUT /api/authors/[id]`: actualizar autor

![PUT /api/authors/id](capturas/04-put-authors-id.png)

#### 5. `POST /api/books`: crear libro

![POST /api/books](capturas/05-post-books.png)

#### 6. `GET /api/books`: listar libros

![GET /api/books](capturas/06-get-books.png)

#### 7. `GET /api/books?genre=Novela`: filtrar por género

![GET /api/books?genre=Novela](capturas/07-get-books-genre.png)

#### 8. `GET /api/books/[id]`: libro por ID

![GET /api/books/id](capturas/08-get-books-id.png)

#### 9. `GET /api/authors/[id]/books`: libros de un autor

![GET /api/authors/id/books](capturas/09-get-authors-books.png)

#### 10. `DELETE /api/books/[id]`: eliminar libro

![DELETE /api/books/id](capturas/10-delete-books-id.png)

#### 11. `GET /api/books/search`: búsqueda, filtros, paginación y orden

![GET /api/books/search](capturas/11-get-books-search.png)

#### 12. `GET /api/authors/[id]/stats`: estadísticas del autor

![GET /api/authors/id/stats](capturas/12-get-authors-stats.png)
