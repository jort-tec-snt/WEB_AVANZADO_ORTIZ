import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="project-card glass"
    >
      <div className="project-card-media">
        {index !== undefined && (
          <span className="project-card-index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        {/* Imágenes con lazy loading */}
        <Image
          src={project.image}
          alt={project.title}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="project-card-body">
        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-text">{project.description}</p>
        <ul className="tag-list">
          {project.technologies.slice(0, 3).map((tech) => (
            <li key={tech} className="tag">
              {tech}
            </li>
          ))}
          {project.technologies.length > 3 && (
            <li className="tag">+{project.technologies.length - 3}</li>
          )}
        </ul>
      </div>
    </Link>
  );
}
