import Link from "next/link";

export default function CharacterNotFound() {
  return (
    <main className="px-4 py-16 sm:px-8">
      <div className="mx-auto grid max-w-3xl items-center gap-8 sm:grid-cols-[auto_1fr]">
        <div
          aria-hidden
          className="size-36 rounded-full border-2 border-dashed border-hull-bright bg-[radial-gradient(circle,var(--color-void-raised)_0_40%,var(--color-void)_41%)]"
        />
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-portal">
            404 · Dimensión vacía
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Este personaje no existe en ningún universo registrado
          </h1>
          <p className="mt-3 text-haze">
            Revisa el id en la URL o vuelve al expediente completo.
          </p>
          <Link
            href="/rick-and-morty"
            className="mt-6 inline-block rounded-plate bg-portal px-5 py-2.5 font-bold text-void transition hover:bg-glow"
          >
            ← Ver todos los personajes
          </Link>
        </div>
      </div>
    </main>
  );
}
