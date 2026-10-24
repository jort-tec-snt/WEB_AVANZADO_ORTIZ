import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";
import NavLinks from "./_components/NavLinks";

export const metadata: Metadata = {
  title: "Rick and Morty - Next.js",
  description: "Expediente interdimensional de personajes de Rick and Morty",
};

interface RickAndMortyLayoutProps {
  children: ReactNode;
}

export default function RickAndMortyLayout({ children }: RickAndMortyLayoutProps) {
  return (
    <div className="theme-portal min-h-screen bg-void text-glow">
      <nav className="sticky top-0 z-50 border-b border-hull bg-void/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-8">
          {/* Portal: anillos concéntricos en verde portal */}
          <span
            aria-hidden
            className="size-8 shrink-0 rounded-full border-2 border-portal bg-[radial-gradient(circle,var(--color-portal)_0_22%,var(--color-portal-deep)_23%_45%,transparent_46%)]"
          />
          <Link
            href="/rick-and-morty"
            className="text-lg font-bold tracking-tight transition-colors hover:text-portal"
          >
            Expediente Rick and Morty
          </Link>
          <div className="ml-auto">
            <NavLinks />
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
