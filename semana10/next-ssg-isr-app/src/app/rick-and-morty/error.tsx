"use client"; // Los error boundaries deben ser Client Components

import { useEffect } from "react";
import Link from "next/link";

export default function RickAndMortyError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-xl rounded-plate border border-dead/60 bg-void-raised p-6 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-widest text-dead">
          Fallo en el portal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          No pudimos abrir esta dimensión
        </h1>
        <p className="mt-3 text-haze">
          La API de Rick and Morty no respondió como esperábamos. Puede ser un fallo
          temporal; vuelve a intentarlo en unos segundos.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-plate bg-portal px-5 py-2.5 font-bold text-void transition hover:bg-glow active:translate-y-px"
          >
            Reintentar
          </button>
          <Link
            href="/rick-and-morty"
            className="rounded-plate border border-hull-bright px-5 py-2.5 font-bold transition hover:border-portal hover:text-portal"
          >
            Ver todos los personajes
          </Link>
        </div>
      </div>
    </main>
  );
}
