import Link from 'next/link';
import { personalInfo } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-bar">
          <p>
            © {new Date().getFullYear()} {personalInfo.name}. Todos los derechos
            reservados.
          </p>
          <div className="footer-links">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <Link href="/contact">Contacto</Link>
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} aria-label="Email">
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
