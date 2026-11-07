# WEB_AVANZADO_ORTIZ

Trabajos de Desarrollo de Aplicaciones Web Avanzado (DAWA) – TECSUP, organizados por semana.

| Carpeta | Contenido |
|---|---|
| `semana08/express-mongo-auth` | Laboratorio 08: despliegue de aplicaciones con JWT (Render + GitHub Actions) |
| [`semana09`](semana09/) | Laboratorio 09: introducción a Next.js (CSR vs SSR) con PokeAPI, Open-Meteo y OMDb. Incluye la galería CryptaCine |
| [`semana10`](semana10/) | Laboratorio 10: enrutamiento y páginas en Next.js (SSG e ISR) con PokeAPI y la API de Rick and Morty |
| [`semana11`](semana11/) | Laboratorio 11: componentes y estilización (CSS Modules, Tailwind CSS y shadcn/ui) con un dashboard de proyectos de tema Frutiger Aero |
| [`semana12`](semana12/) | Laboratorio 12: API Routes en Next.js con Prisma y PostgreSQL (Supabase). API REST de autores y libros (CRUD, búsqueda con filtros y paginación, estadísticas) y una interfaz para consumirla. Desplegado en [Vercel](https://next-api-routes-ortizdev-x86.vercel.app). El detalle y las evidencias están en el [README de la semana 12](semana12/README.md) |

Cada semana vive en su carpeta `semanaXX/` con su propio `package.json` y `.env.example`.
Los workflows de CI/CD están en `.github/workflows/` (GitHub solo los lee desde la raíz), uno por semana: `deploy-semanaXX.yml`.
