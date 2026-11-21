import Link from 'next/link';
import { personalInfo } from '@/lib/data';
import NavLinks from '@/components/NavLinks';

export default function Header() {
  return (
    <header className="site-header">
      <nav className="wrap" aria-label="Principal">
        <div className="nav-bar">
          <Link href="/" className="brand">
            <span className="brand-orb" aria-hidden="true" />
            {personalInfo.name}
          </Link>
          <NavLinks />
        </div>
      </nav>
    </header>
  );
}
