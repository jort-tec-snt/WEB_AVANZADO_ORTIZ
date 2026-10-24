import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pokemon, PokemonListResponse } from "@/types/pokemon";
import { TiltCard, TiltLayer } from "@/components/ui/tilt-card";

async function getPokemon(name: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
    next: { revalidate: 86400 }, // ISR: revalida cada 24 horas
  });

  if (res.status === 404) notFound(); // Renderiza pokemon/not-found.tsx
  if (!res.ok) throw new Error("Pokémon no encontrado"); // Renderiza pokemon/error.tsx
  return res.json();
}

// SSG: prerenderiza en el build las 151 rutas /pokemon/[name]
export async function generateStaticParams() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data: PokemonListResponse = await res.json();

  return data.results.map((pokemon) => ({
    name: pokemon.name,
  }));
}

// Metadata dinámica para cada página de Pokémon
export async function generateMetadata({
  params,
}: PageProps<"/pokemon/[name]">): Promise<Metadata> {
  const { name } = await params;
  const pokemon = await getPokemon(name);

  return {
    title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} - Pokédex`,
    description: `Información sobre ${pokemon.name}`,
  };
}

const typeColors: Record<string, string> = {
  fire: "bg-type-fire",
  water: "bg-type-water",
  grass: "bg-type-grass",
  electric: "bg-type-electric",
  psychic: "bg-type-psychic",
  ice: "bg-type-ice",
  dragon: "bg-type-dragon",
  dark: "bg-type-dark",
  fairy: "bg-type-fairy",
  normal: "bg-type-normal",
  fighting: "bg-type-fighting",
  flying: "bg-type-flying",
  poison: "bg-type-poison",
  ground: "bg-type-ground",
  rock: "bg-type-rock",
  bug: "bg-type-bug",
  ghost: "bg-type-ghost",
  steel: "bg-type-steel",
};

// Tipos de color claro: el texto crema no contrasta, se usa tinta
const lightTypes = new Set(["electric", "ice", "fairy"]);

const textOn = (type: string) => (lightTypes.has(type) ? "text-ink" : "text-paper");

const MAX_BASE_STAT = 255;

export default async function PokemonDetail({
  params,
}: PageProps<"/pokemon/[name]">) {
  const { name } = await params;
  const pokemon = await getPokemon(name);
  const mainTypeName = pokemon.types[0].type.name;
  const mainType = typeColors[mainTypeName] ?? "bg-type-normal";

  return (
    <main className="px-4 py-10 sm:px-8">
      <article className="mx-auto max-w-5xl border-2 border-ink bg-paper shadow-[6px_6px_0_var(--color-ink)]">
        <header className={`${mainType} flex items-end justify-between gap-4 border-b-2 border-ink px-6 py-5 sm:px-8 ${textOn(mainTypeName)}`}>
          <h1 className="text-4xl font-bold capitalize tracking-tight sm:text-5xl">
            {pokemon.name}
          </h1>
          <p className="font-mono text-2xl font-bold opacity-80 sm:text-3xl">
            #{pokemon.id.toString().padStart(3, "0")}
          </p>
        </header>

        <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="plate-dots flex items-center justify-center border-b-2 border-ink bg-paper-deep/60 p-8 md:border-r-2 md:border-b-0">
            {/* 3D Card: la ilustración se inclina siguiendo al puntero */}
            <TiltCard maxTilt={14}>
              <TiltLayer depth={60}>
                <Image
                  width={256}
                  height={256}
                  src={pokemon.sprites.other["official-artwork"].front_default}
                  alt={pokemon.name}
                  className="size-56 drop-shadow-[0_10px_0_rgba(29,27,24,0.15)] sm:size-64"
                  loading="eager" // Imagen principal (LCP): se carga de inmediato
                />
              </TiltLayer>
            </TiltCard>
          </div>

          <div className="space-y-8 p-6 sm:p-8">
            <section>
              <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-soft">
                Tipos
              </h2>
              <div className="flex flex-wrap gap-2">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`${typeColors[type.type.name] ?? "bg-type-normal"} rounded-plate border-2 border-ink px-3 py-1 text-sm font-bold capitalize ${textOn(type.type.name)}`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-soft">
                Estadísticas base
              </h2>
              <dl className="space-y-2.5">
                {pokemon.stats.map((stat, index) => (
                  <div
                    key={stat.stat.name}
                    className="grid grid-cols-[8.5rem_2.5rem_1fr] items-center gap-3"
                  >
                    <dt className="truncate text-sm font-semibold capitalize">
                      {stat.stat.name.replace("-", " ")}
                    </dt>
                    <dd className="text-right font-mono text-sm font-bold">
                      {stat.base_stat}
                    </dd>
                    <dd className="h-3 border-2 border-ink bg-paper-deep">
                      <div
                        className={`${mainType} bar-grow h-full`}
                        style={{
                          width: `${(stat.base_stat / MAX_BASE_STAT) * 100}%`,
                          animationDelay: `${index * 70}ms`,
                        }}
                      />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-soft">
                Información
              </h2>
              <dl className="grid grid-cols-2 gap-px border-2 border-ink bg-ink">
                <div className="bg-paper p-3">
                  <dt className="text-xs text-ink-soft">Altura</dt>
                  <dd className="font-mono text-lg font-bold">{pokemon.height / 10} m</dd>
                </div>
                <div className="bg-paper p-3">
                  <dt className="text-xs text-ink-soft">Peso</dt>
                  <dd className="font-mono text-lg font-bold">{pokemon.weight / 10} kg</dd>
                </div>
                <div className="col-span-2 bg-paper p-3">
                  <dt className="text-xs text-ink-soft">Habilidades</dt>
                  <dd className="font-semibold capitalize">
                    {pokemon.abilities
                      .map((a) => a.ability.name.replace("-", " ") + (a.is_hidden ? " (oculta)" : ""))
                      .join(", ")}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>

        <footer className="border-t-2 border-ink bg-paper-deep/60 px-6 py-5 sm:px-8">
          <Link
            href="/pokemon"
            className="inline-block rounded-plate border-2 border-ink bg-ink px-5 py-2.5 font-bold text-paper transition hover:bg-dex"
          >
            ← Volver al Pokédex
          </Link>
        </footer>
      </article>
    </main>
  );
}
