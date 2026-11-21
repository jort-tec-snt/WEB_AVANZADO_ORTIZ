import { Metadata } from 'next';
import { projects } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Explora mi colección de proyectos de desarrollo web y aplicaciones',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Proyectos - Portafolio',
    description: 'Explora mi colección de proyectos de desarrollo web',
    images: ['/og-projects.jpg'],
  },
};

export default function ProjectsPage() {
  return (
    <div className="wrap section">
      <p className="eyebrow">Portafolio</p>
      <h1 className="page-title">Mis Proyectos</h1>
      <p className="lead" style={{ marginBottom: 'var(--space-12)' }}>
        Una colección de proyectos en los que he trabajado
      </p>

      <div className="grid-projects">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}
