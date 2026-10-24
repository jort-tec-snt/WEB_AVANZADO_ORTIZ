"use client"; // Los error boundaries deben ser Client Components

import { useEffect } from "react";
import Link from "next/link";
import { IoWarning } from "react-icons/io5";

export default function PokemonError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest =
    error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <main className="px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-xl border-2 border-ink bg-paper shadow-[6px_6px_0_var(--color-dex)]">
        <div className="flex items-center gap-2 border-b-2 border-ink bg-ink px-5 py-2 font-mono text-xs uppercase tracking-widest text-paper">
          <IoWarning aria-hidden className="text-type-electric" size={16} />
          Error de lectura
        </div>
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            La Pokédex perdió la señal
          </h1>
          <p className="mt-3 text-ink-soft">
            No pudimos obtener los datos desde la PokeAPI. Puede ser un fallo
            temporal del servicio o de tu conexión.
          </p>
          {digest && (
            <p className="mt-4 font-mono text-xs text-ink-soft">
              código: {digest}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="rounded-plate border-2 border-ink bg-dex px-5 py-2.5 font-bold text-paper transition hover:bg-dex-dark active:translate-y-px"
            >
              Reintentar
            </button>
            <Link
              href="/pokemon"
              className="rounded-plate border-2 border-ink px-5 py-2.5 font-bold transition hover:bg-paper-deep"
            >
              Volver al Pokédex
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
