import { Metadata } from 'next';
import { personalInfo } from '@/lib/data';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contacto',
  description: `Ponte en contacto con ${personalInfo.name} para colaborar en proyectos web`,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contacto - Portafolio',
    description: `Ponte en contacto con ${personalInfo.name}`,
  },
};

export default function ContactPage() {
  return (
    <div className="wrap section">
      <p className="eyebrow">Hablemos</p>
      <h1 className="page-title">Contacto</h1>
      <p className="lead" style={{ marginBottom: 'var(--space-8)' }}>
        ¿Tienes un proyecto en mente o quieres colaborar? Escríbeme.
      </p>

      <div className="contact">
        <div className="contact-panel glass">
          {personalInfo.email ? (
            <ContactForm email={personalInfo.email} />
          ) : (
            <p className="notice">
              El formulario no está disponible por ahora. Puedes escribirme a
              través de GitHub.
            </p>
          )}
        </div>

        <aside className="contact-panel glass">
          <p className="eyebrow">Otros canales</p>
          <p className="prose" style={{ marginTop: 'var(--space-3)' }}>
            <span style={{ display: 'block', marginBottom: 'var(--space-4)', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              También puedes ver mi trabajo y contribuciones en GitHub.
            </span>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-leaf"
            >
              Ir a GitHub
            </a>
          </p>
        </aside>
      </div>
    </div>
  );
}
