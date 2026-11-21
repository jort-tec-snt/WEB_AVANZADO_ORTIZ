import { Metadata } from 'next';
import Image from 'next/image';
import { personalInfo, skillGroups } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Sobre Mí',
  description: `Conoce más sobre ${personalInfo.name}, ${personalInfo.title}`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
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
            Soy desarrollador de software y trabajo bajo el nombre OrtizDev.
            Construyo backends y APIs, aplicaciones móviles y sistemas IoT, y
            automatizo los procesos de empresa que los rodean.
          </p>
          <p>
            Vengo del mundo de los datos geoespaciales. Me gustan los sistemas
            que tocan el mundo físico, así que me muevo entre código, datos y
            dispositivos. He desarrollado plataformas web, una app móvil de
            primeros auxilios y un sistema de hardware y software para tiendas
            pequeñas.
          </p>
          <p>
            En este curso de Desarrollo Web Avanzado he trabajado con Next.js,
            API Routes con Prisma, autenticación con NextAuth.js y despliegue en
            Vercel. Soy curioso, investigo tecnología todo el tiempo y sé que el
            camino es largo.
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
          <div className="skills-grid">
            {skillGroups.map((group) => (
              <div key={group.area}>
                <h3 className="skills-area">{group.area}</h3>
                <ul className="tag-list">
                  {group.items.map((skill) => (
                    <li key={skill} className="tag">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
