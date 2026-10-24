import Link from "next/link";

export default function PokemonNotFound() {
  return (
    <main className="px-4 py-16 sm:px-8">
      <div className="mx-auto grid max-w-3xl items-center gap-8 sm:grid-cols-[auto_1fr]">
        <div
          aria-hidden
          className="plate-dots flex size-40 items-center justify-center rounded-plate border-2 border-dashed border-ink-soft bg-paper-deep/60 font-mono text-6xl font-bold text-ink-soft"
        >
          ???
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-dex">
            404 · Registro inexistente
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Este Pokémon no está en la Pokédex
          </h1>
          <p className="mt-3 text-ink-soft">
            Revisa el nombre en la URL o vuelve a la lista de los 151 de Kanto.
          </p>
          <Link
            href="/pokemon"
            className="mt-6 inline-block rounded-plate border-2 border-ink bg-ink px-5 py-2.5 font-bold text-paper transition hover:bg-dex"
          >
            ← Volver al Pokédex
          </Link>
        </div>
      </div>
    </main>
  );
}
