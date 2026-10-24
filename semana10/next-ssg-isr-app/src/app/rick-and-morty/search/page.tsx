import { Metadata } from "next";
import CharacterSearch from "../_components/CharacterSearch";

export const metadata: Metadata = {
  title: "Buscar personajes - Rick and Morty",
  description: "Búsqueda en tiempo real por nombre, estado, tipo y género",
};

export default function SearchPage() {
  return (
    <main className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-portal">
            CSR · useState + useEffect
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Buscar personajes
          </h1>
          <p className="mt-3 max-w-xl text-haze">
            Los resultados se actualizan mientras escribes, consultando la API
            directamente desde el navegador.
          </p>
        </header>
        <CharacterSearch />
      </div>
    </main>
  );
}
