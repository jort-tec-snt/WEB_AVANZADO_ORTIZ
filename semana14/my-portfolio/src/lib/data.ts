import { Project } from '@/types';

const REPO = 'https://github.com/jort-tec-snt/WEB_AVANZADO_ORTIZ/tree/main';

export const projects: Project[] = [
  {
    slug: 'api-routes-prisma',
    title: 'API REST de Autores y Libros',
    description:
      'API REST con Next.js, Prisma y PostgreSQL (Supabase): CRUD, búsqueda con filtros, paginación y estadísticas',
    image:
      '/img/project-api.jpg',
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
      '/img/project-auth.jpg',
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
      '/img/project-dashboard.jpg',
    technologies: ['Next.js', 'CSS Modules', 'Tailwind', 'shadcn/ui'],
    githubUrl: `${REPO}/semana11`,
    featured: false,
  },
];

export const personalInfo = {
  name: 'Jerónimo Ortiz',
  title: 'Desarrollador de software',
  description:
    'Backends, APIs, apps móviles y sistemas IoT. Construyo software que funciona y automatizo los procesos que lo rodean.',
  // El correo de contacto se define por variable de entorno (no va en el repositorio)
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
  github: 'https://github.com/jort-tec-snt',
  linkedin: 'https://www.linkedin.com/in/jeronimo-ortiz-08b157447/',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  avatar: '/img/avatar.jpg',
};

export const skillGroups: { area: string; items: string[] }[] = [
  { area: 'Backend', items: ['Node.js', 'Express', 'Laravel', 'Spring Boot', 'Django', 'Java'] },
  { area: 'Web', items: ['Next.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS'] },
  { area: 'Móvil', items: ['Android Studio', 'Kotlin', 'Flutter'] },
  { area: 'Datos', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'Prisma'] },
  { area: 'Nube y DevOps', items: ['Docker', 'AWS', 'Jenkins', 'Git', 'Vercel'] },
  { area: 'Hardware y sistemas', items: ['Arduino', 'Linux', 'Línea de comandos'] },
];
