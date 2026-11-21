import { Project } from '@/types';

const REPO = 'https://github.com/jort-tec-snt/WEB_AVANZADO_ORTIZ/tree/main';

export const projects: Project[] = [
  {
    slug: 'api-routes-prisma',
    title: 'API REST de Autores y Libros',
    description:
      'API REST con Next.js, Prisma y PostgreSQL (Supabase): CRUD, búsqueda con filtros, paginación y estadísticas',
    image:
      'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Supabase'],
    demoUrl: 'https://next-api-routes-ortizdev-x86.vercel.app',
    githubUrl: `${REPO}/semana12`,
    featured: true,
  },
  {
    slug: 'aerogate-auth',
    title: 'AeroGate: Autenticación',
    description:
      'Autenticación con NextAuth.js (Google, GitHub y credenciales), bloqueo por intentos y rutas protegidas',
    image:
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    technologies: ['Next.js', 'NextAuth.js', 'Prisma', 'bcrypt', 'Tailwind'],
    githubUrl: `${REPO}/semana13/next-auth-app`,
    featured: true,
  },
  {
    slug: 'dashboard-frutiger-aero',
    title: 'Dashboard Frutiger Aero',
    description:
      'Dashboard de proyectos con CSS Modules, Tailwind CSS y shadcn/ui bajo un tema Frutiger Aero',
    image:
      'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    technologies: ['Next.js', 'CSS Modules', 'Tailwind', 'shadcn/ui'],
    githubUrl: `${REPO}/semana11`,
    featured: false,
  },
];

export const personalInfo = {
  name: 'Jerónimo Ortiz',
  title: 'Full Stack Developer',
  description:
    'Desarrollador apasionado por crear experiencias web excepcionales',
  // El correo de contacto se define por variable de entorno (no va en el repositorio)
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
  github: 'https://github.com/jort-tec-snt',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  avatar:
    'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};
