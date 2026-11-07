# Semana 12: API Routes con Next.js, Prisma y Supabase

Laboratorio 12 de Desarrollo de Aplicaciones Web Avanzado (DAWA), Tecsup. Proyecto en [`next-api-routes/`](next-api-routes/).

Stack: Next.js 16 (App Router), Prisma 7, PostgreSQL en Supabase y pnpm.

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
