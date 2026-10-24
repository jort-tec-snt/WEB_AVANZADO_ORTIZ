import Link from "next/link";
import Image from "next/image";
import { IoMdList } from "react-icons/io";
import { PokemonListResponse, SimplePokemon } from "@/types/pokemon";

async function getPokemons(): Promise<SimplePokemon[]> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151", {
    next: { revalidate: 86400 }, // ISR: revalida cada 24 horas
  });
  if (!res.ok) throw new Error("Error al cargar pokémon");
  const data: PokemonListResponse = await res.json();
  return data.results.map((pokemon, index) => ({
    name: pokemon.name,
    id: index + 1,
  }));
}

export default async function PokemonList() {
  const pokemons = await getPokemons();

  return (
    <main className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-4xl">
            <IoMdList size={36} aria-hidden className="text-dex" />
            Lista de Pokémons
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
            ISR · revalidate 86400 s · {pokemons.length} entradas
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {pokemons.map((pokemon) => (
            <li key={pokemon.name}>
              <Link
                href={`/pokemon/${pokemon.name}`}
                className="group block rounded-plate border-2 border-rule bg-paper transition hover:-translate-y-1 hover:border-ink hover:shadow-[4px_4px_0_var(--color-ink)]"
              >
                <div className="plate-dots flex aspect-square items-center justify-center border-b-2 border-rule bg-paper-deep/60 p-4 transition-colors group-hover:border-ink">
                  <Image
                    width={100}
                    height={100}
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
                    alt={pokemon.name}
                    className="size-24 sm:size-28"
                    loading="lazy" // Lazy loading: la imagen se pide al acercarse al viewport
                  />
                </div>
                <div className="flex items-baseline justify-between gap-2 px-3 py-2">
                  <h2 className="truncate text-base font-bold capitalize sm:text-lg">
                    {pokemon.name}
                  </h2>
                  <span className="font-mono text-xs text-ink-soft transition-colors group-hover:text-dex">
                    #{pokemon.id.toString().padStart(3, "0")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
