import { Metadata } from 'next';
import Image from 'next/image';
import { personalInfo } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Sobre Mí',
  description: `Conoce más sobre ${personalInfo.name}, ${personalInfo.title}`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const skills = [
    'JavaScript/TypeScript',
    'React & Next.js',
    'Node.js & Express',
    'PostgreSQL & MongoDB',
    'Tailwind CSS',
    'Git & GitHub',
    'Docker',
    'AWS',
  ];

  return (
    <div className="wrap section">
      <p className="eyebrow">Perfil</p>
      <h1 className="page-title">Sobre Mí</h1>

      <div className="about">
        <div className="about-photo glass">
          <Image
            src={personalInfo.avatar}
            alt={personalInfo.name}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        <div className="prose">
          <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>
            ¡Hola! Soy {personalInfo.name}
          </h2>
          <p>
            Soy un desarrollador full stack apasionado por crear experiencias
            web excepcionales. Me especializo en construir aplicaciones modernas
            y escalables.
          </p>
          <p>
            Mi enfoque está en escribir código limpio, mantenible y eficiente,
            siempre buscando las mejores prácticas y las últimas tecnologías
            para entregar productos de alta calidad.
          </p>
          <p>
            Cuando no estoy programando, me gusta contribuir a proyectos de
            código abierto, escribir artículos técnicos y aprender nuevas
            tecnologías.
          </p>
        </div>
      </div>

      {/* Skills Section */}
      <section className="section">
        <div className="skills-panel glass">
          <p className="eyebrow">Stack</p>
          <h2 className="section-title" style={{ marginBottom: 'var(--space-6)' }}>
            Habilidades Técnicas
          </h2>
          <ul className="tag-list">
            {skills.map((skill) => (
              <li key={skill} className="tag" style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
