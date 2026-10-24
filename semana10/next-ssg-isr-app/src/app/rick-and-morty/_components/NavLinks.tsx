"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/rick-and-morty", label: "Personajes" },
  { href: "/rick-and-morty/search", label: "Buscar" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex gap-1">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`block rounded-plate px-3 py-1.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-portal text-void"
                  : "text-haze hover:bg-void-raised hover:text-glow"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
