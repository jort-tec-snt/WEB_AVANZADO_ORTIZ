import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/data';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Proyecto no encontrado',
    };
  }

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.image],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="wrap section">
      <Link href="/projects" className="back-link">
        ← Volver a Proyectos
      </Link>

      <article>
        <p className="eyebrow">Proyecto</p>
        <h1 className="page-title">{project.title}</h1>

        <div className="detail">
          <div className="detail-media glass">
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 720px"
            />
          </div>

          <div className="detail-panel glass">
            <p className="lead">{project.description}</p>

            <div>
              <h2>Tecnologías Utilizadas</h2>
              <ul className="tag-list">
                {project.technologies.map((tech) => (
                  <li key={tech} className="tag">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-actions">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Ver Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glass"
                >
                  Ver Código
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
