import Image from 'next/image';
import Link from 'next/link';
import { projects, personalInfo } from '@/lib/data';
import ProjectCard from '@/components/ProjectCard';

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured);
  const technologies = new Set(projects.flatMap((p) => p.technologies));

  return (
    <div className="wrap">
      {/* Hero Section */}
      <section className="hero">
        <div>
          <p className="eyebrow">{personalInfo.title}</p>
          <h1 className="hero-title">
            Hola, soy <span>{personalInfo.name}</span>
          </h1>
          <p className="lead">{personalInfo.description}</p>
          <div className="hero-actions">
            <Link href="/projects" className="btn btn-primary">
              Ver Proyectos
            </Link>
            <Link href="/about" className="btn btn-glass">
              Sobre Mí
            </Link>
          </div>
          <ul className="hero-stats">
            <li>
              <strong>{projects.length}</strong>
              <span>Proyectos</span>
            </li>
            <li>
              <strong>{technologies.size}</strong>
              <span>Tecnologías</span>
            </li>
          </ul>
        </div>

        <div className="orb">
          <div className="orb-photo">
            <Image
              src={personalInfo.avatar}
              alt={personalInfo.name}
              fill
              priority
              sizes="(max-width: 832px) 80vw, 352px"
            />
            <span className="orb-shine" aria-hidden="true" />
          </div>
          <span className="bubble bubble-a" aria-hidden="true" />
          <span className="bubble bubble-b" aria-hidden="true" />
          <span className="bubble bubble-c" aria-hidden="true" />
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Selección</p>
            <h2 className="section-title">Proyectos Destacados</h2>
          </div>
          <Link href="/projects" className="btn btn-glass">
            Ver todos
          </Link>
        </div>
        <div className="grid-projects">
          {featuredProjects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
