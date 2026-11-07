"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Library, Users } from "lucide-react";

const LINKS = [
  { href: "/", label: "Autores", Icon: Users },
  { href: "/books", label: "Libros", Icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="nav">
      <div className="nav__in">
        <Link href="/" className="brand">
          <Library size={22} strokeWidth={1.75} className="brand__icon" aria-hidden />
          <span className="brand__mark">Fichero</span>
          <span className="brand__sub muted">biblioteca de autores</span>
        </Link>
        <nav className="nav__links" aria-label="Principal">
          {LINKS.map(({ href, label, Icon }) => {
            const active = href === "/" ? pathname === "/" || pathname.startsWith("/authors") : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className="nav__link" aria-current={active ? "page" : undefined}>
                <Icon size={16} strokeWidth={2} aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
