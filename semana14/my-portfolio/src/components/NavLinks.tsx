'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/projects', label: 'Proyectos' },
  { href: '/about', label: 'Sobre Mí' },
  { href: '/contact', label: 'Contacto' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="nav-links">
      {links.map((link) => {
        const active =
          link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link href={link.href} aria-current={active ? 'page' : undefined}>
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
