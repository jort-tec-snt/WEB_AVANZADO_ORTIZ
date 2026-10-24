import { ReactNode } from "react";
import { Metadata } from "next";
import { IoGameController } from "react-icons/io5";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pokédex - Next.js",
  description: "Explora el mundo Pokémon",
};

interface PokemonLayoutProps {
  children: ReactNode;
}

export default function PokemonLayout({ children }: PokemonLayoutProps) {
  return (
    <div className="min-h-screen bg-paper">
      <nav className="sticky top-0 z-50 border-b-4 border-ink bg-dex text-paper">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-8">
          {/* Lente de la Pokédex */}
          <span
            aria-hidden
            className="size-9 shrink-0 rounded-full border-[3px] border-paper bg-type-water shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.25)]"
          />
          {/* Link reemplaza a <a> en la navegación interna: no recarga la página */}
          <Link
            href="/pokemon"
            className="flex items-center gap-2 text-xl font-bold tracking-tight transition-colors hover:text-ink"
          >
            <IoGameController size={26} aria-hidden />
            Pokédex Next.js
          </Link>
          <span className="ml-auto hidden font-mono text-xs uppercase tracking-widest text-paper/80 sm:block">
            Kanto · 151 registros
          </span>
        </div>
      </nav>
      {children}
    </div>
  );
}
