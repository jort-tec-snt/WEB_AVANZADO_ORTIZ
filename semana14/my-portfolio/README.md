# Portafolio SEO · Laboratorio 14: Optimización y SEO con Next.js

Portafolio personal en Next.js (App Router) optimizado para buscadores: **meta tags dinámicos**, **Open Graph y Twitter Card**,
**sitemap.xml y robots.txt dinámicos**, imágenes optimizadas con `next/image` y despliegue en Vercel con dominio DNS gratuito.
Interfaz de estilo Frutiger Aero.

## Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · ESLint · pnpm

## Funcionalidad
| Requisito del laboratorio | Dónde está |
|---|---|
| Meta tags globales (Open Graph, Twitter, robots) | `src/app/layout.tsx` (`metadata` con `metadataBase` y plantilla de título) |
| Meta tags por página | `src/app/projects/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx` |
| Meta tags dinámicos por proyecto | `src/app/projects/[slug]/page.tsx` (`generateMetadata` y `generateStaticParams`) |
| Componentes compartidos | `src/components/Header.tsx`, `Footer.tsx`, `ProjectCard.tsx` |
| Imágenes AVIF/WebP y lazy loading | `next.config.ts` (`formats`, `deviceSizes`) y `next/image` con `loading="lazy"` y `sizes` |
| Sitemap dinámico | `src/app/sitemap.ts` |
| robots.txt dinámico | `src/app/robots.ts` |
| Página de contacto (tarea) | `src/app/contact/page.tsx` y `src/components/ContactForm.tsx` |
| Sitemap y robots actualizados (tarea) | `/contact` incluido en `sitemap.ts` |
| Despliegue en Vercel y dominio (tarea) | <https://ortizdev.duckdns.org> |

### Diferencias respecto a la guía
- **Gestor de paquetes:** pnpm en lugar de npm.
- **Tipografía:** Inter autoalojada con `next/font/local` (`src/app/fonts`). Con `next/font/google` el build fallaba al no poder descargar la fuente en el entorno de desarrollo.
- **Tailwind:** integración oficial con `@tailwindcss/postcss` (`postcss.config.mjs`).
- **Datos:** proyectos reales del curso (semanas 11, 12 y 13) y mis datos personales en lugar de los ejemplos. El correo de contacto no está en el código: se define con `NEXT_PUBLIC_CONTACT_EMAIL`.
- **Diseño:** estilos propios en `src/styles` (`tokens.css`, `base.css`, `components.css`, `pages.css`) en lugar de las clases genéricas de la guía.
- **Imágenes:** ilustraciones propias en `public/img` y banners Open Graph en `public/og-*.jpg`.
- **Dominio:** Freenom ya no ofrece dominios gratuitos, así que se usó **DuckDNS** (DNS gratuito) con un registro A hacia Vercel.

## Ejecución local
```bash
pnpm install
cp .env.example .env.local   # completar los valores
pnpm dev
```

Variables (ver `.env.example`): `NEXT_PUBLIC_SITE_URL` (URL pública, también usada en sitemap, robots y `og:`) y
`NEXT_PUBLIC_CONTACT_EMAIL` (opcional; sin ella el formulario de contacto no se muestra).

## Estructura
- `src/app`: páginas, `sitemap.ts`, `robots.ts` y `fonts`.
- `src/components`: `Header`, `NavLinks`, `Footer`, `ProjectCard`, `ContactForm`.
- `src/lib/data.ts`: proyectos, datos personales y habilidades.
- `src/styles`: tokens y estilos del tema Frutiger Aero.
- `public/img`: foto de presentación e ilustraciones de los proyectos.

## Evidencias
Capturas en [`../capturas`](../capturas/).

### Páginas de la aplicación (local)
![Inicio](../capturas/01-inicio.png)
![Proyectos](../capturas/02-proyectos.png)
![Detalle de proyecto](../capturas/03-detalle-proyecto.png)
![Sobre mí](../capturas/04-sobre-mi.png)
![Contacto](../capturas/07-contacto.png)

### sitemap.xml y robots.txt (local)
![sitemap.xml](../capturas/05-sitemap-xml.png)
![robots.txt](../capturas/06-robots-txt.png)

### Meta tags en DevTools (dominio de producción)
`<head>` con `<title>`, `description`, Open Graph (`og:title`, `og:description`, `og:url`, `og:image`, `og:locale`, `og:type`) y Twitter Card.

![Inicio del head](../capturas/09-head-title-devtools.png)
![Meta tags og y twitter](../capturas/08-head-og-devtools.png)

### Lighthouse (PageSpeed Insights sobre el dominio)
| Modo | Rendimiento | Accesibilidad | Prácticas recomendadas | SEO |
|---|---|---|---|---|
| Móvil | 98 | 100 | 100 | 100 |
| Ordenador | 100 | 100 | 100 | 100 |

Métricas en móvil: FCP 0,8 s · LCP 2,3 s · TBT 30 ms · CLS 0 · Speed Index 0,8 s.

![Lighthouse móvil](../capturas/31-lighthouse-movil-puntajes.png)
![Métricas móvil](../capturas/32-lighthouse-movil-metricas.png)
![Accesibilidad móvil](../capturas/33-lighthouse-movil-accesibilidad.png)
![Prácticas recomendadas móvil](../capturas/34-lighthouse-movil-practicas.png)
![SEO móvil](../capturas/35-lighthouse-movil-seo.png)
![Lighthouse ordenador](../capturas/37-lighthouse-desktop-puntajes.png)

### Producción (Vercel, dominio ortizdev.duckdns.org)
![Inicio en producción](../capturas/11-dominio-inicio.png)
![Proyectos en producción](../capturas/12-dominio-proyectos.png)
![Detalle en producción](../capturas/13-dominio-detalle-proyecto.png)
![Sobre mí en producción](../capturas/14-dominio-sobre-mi.png)
![Contacto en producción](../capturas/15-dominio-contacto.png)
![sitemap.xml en producción](../capturas/16-dominio-sitemap-xml.png)
![robots.txt en producción](../capturas/17-dominio-robots-txt.png)

## Entrega
- Repositorio: <https://github.com/jort-tec-snt/WEB_AVANZADO_ORTIZ/tree/main/semana14/my-portfolio>
- Dominio: <https://ortizdev.duckdns.org>
- Despliegue en Vercel: <https://portafolio-seo-ortiz.vercel.app>
