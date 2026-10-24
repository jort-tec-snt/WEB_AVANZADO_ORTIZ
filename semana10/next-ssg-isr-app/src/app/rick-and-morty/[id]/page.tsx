import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Character, CharacterListResponse, Episode } from "@/types/rick-and-morty";
import { TiltCard } from "@/components/ui/tilt-card";
import { EncryptedText } from "@/components/ui/encrypted-text";
import {
  RM_API,
  TEN_DAYS,
  genderLabel,
  idFromUrl,
  statusDot,
  statusLabel,
} from "@/lib/rick-and-morty";

// La API limita las ráfagas de peticiones (HTTP 429). Pedir /character/{id} por cada
// una de las 826 páginas hace fallar el build, así que se usa el endpoint múltiple
// (/character/1,2,...) una sola vez: la respuesta queda en la caché de datos y todas
// las páginas la reutilizan.
async function fetchAll<T>(resource: "character" | "episode"): Promise<T[]> {
  const options = { next: { revalidate: TEN_DAYS } }; // ISR: revalida cada 10 días

  const first = await fetch(`${RM_API}/${resource}`, options);
  if (!first.ok) throw new Error(`Error al consultar ${resource}`); // Renderiza rick-and-morty/error.tsx
  const { info }: { info: CharacterListResponse["info"] } = await first.json();

  const ids = Array.from({ length: info.count }, (_, i) => i + 1).join(",");
  const res = await fetch(`${RM_API}/${resource}/${ids}`, options);
  if (!res.ok) throw new Error(`Error al cargar ${resource}`);
  return res.json();
}

async function getCharacter(id: string): Promise<Character> {
  if (!/^\d+$/.test(id)) notFound();

  const characters = await fetchAll<Character>("character");
  const character = characters.find((c) => c.id === Number(id));
  if (!character) notFound(); // Renderiza rick-and-morty/not-found.tsx
  return character;
}

async function getEpisodes(urls: string[]): Promise<Episode[]> {
  const ids = new Set(urls.map(idFromUrl));
  const episodes = await fetchAll<Episode>("episode");
  return episodes.filter((ep) => ids.has(ep.id));
}

// SSG: prerenderiza en el build una ruta /rick-and-morty/[id] por cada personaje
export async function generateStaticParams() {
  const characters = await fetchAll<Character>("character");
  return characters.map((character) => ({ id: String(character.id) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/rick-and-morty/[id]">): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);

  return {
    title: `${character.name} - Rick and Morty`,
    description: `${character.name}: ${character.species}, ${statusLabel[character.status].toLowerCase()}.`,
  };
}

const dateFormat = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "long",
  timeZone: "UTC",
});

export default async function CharacterDetail({
  params,
}: PageProps<"/rick-and-morty/[id]">) {
  const { id } = await params;
  const character = await getCharacter(id);
  const episodes = await getEpisodes(character.episode);

  const fields = [
    { label: "Especie", value: character.species },
    { label: "Tipo", value: character.type || "—" },
    { label: "Género", value: genderLabel[character.gender] },
    { label: "Origen", value: character.origin.name, url: character.origin.url },
    { label: "Ubicación actual", value: character.location.name, url: character.location.url },
    { label: "Registrado en la API", value: dateFormat.format(new Date(character.created)) },
  ];

  return (
    <main className="px-4 py-10 sm:px-8">
      <article className="mx-auto max-w-5xl">
        <Link
          href="/rick-and-morty"
          className="mb-6 inline-block font-mono text-xs uppercase tracking-widest text-haze transition-colors hover:text-portal"
        >
          ← Todos los personajes
        </Link>

        <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div>
            {/* 3D Card + anillo de portal que gira alrededor del retrato */}
            <TiltCard maxTilt={8}>
              <div className="portal-ring isolate">
                <div className="overflow-hidden rounded-[5px] bg-void">
                  <Image
                    src={character.image}
                    alt={character.name}
                    width={300}
                    height={300}
                    className="aspect-square w-full object-cover"
                    loading="eager" // Imagen principal (LCP): se carga de inmediato
                    unoptimized // Igual que en las tarjetas: se pide directo a la API
                  />
                </div>
              </div>
            </TiltCard>
            <p className="mt-3 flex items-center gap-2 rounded-plate border border-hull bg-void-raised px-3 py-2 text-sm">
              <span aria-hidden className={`size-2.5 rounded-full ${statusDot[character.status]}`} />
              <span className="font-semibold">{statusLabel[character.status]}</span>
              <span className="ml-auto font-mono text-xs text-haze">status: {character.status}</span>
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-portal">
              Expediente #{character.id.toString().padStart(3, "0")}
            </p>
            <h1 className="mt-2 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {/* Encrypted Text: el nombre se "descifra" al abrir el expediente */}
              <EncryptedText text={character.name} encryptedClassName="text-portal/70" />
            </h1>

            <dl className="mt-6 grid gap-px overflow-hidden rounded-plate border border-hull bg-hull sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.label} className="bg-void-raised px-4 py-3">
                  <dt className="text-xs text-haze">{field.label}</dt>
                  <dd className="mt-0.5 font-semibold">{field.value}</dd>
                  {field.url && (
                    <dd className="mt-1 truncate font-mono text-[11px] text-haze/80">
                      {field.url}
                    </dd>
                  )}
                </div>
              ))}
              <div className="bg-void-raised px-4 py-3 sm:col-span-2">
                <dt className="text-xs text-haze">Recurso en la API</dt>
                <dd className="mt-0.5 truncate font-mono text-sm">{character.url}</dd>
              </div>
            </dl>

            <section className="mt-8">
              <h2 className="mb-3 flex items-baseline justify-between gap-4 border-b border-hull pb-2">
                <span className="text-lg font-bold">Episodios</span>
                <span className="font-mono text-xs text-haze">
                  {character.episode.length} apariciones
                </span>
              </h2>
              <ul className="grid max-h-80 gap-1 overflow-y-auto pr-1 sm:grid-cols-2">
                {episodes.map((ep) => (
                  <li
                    key={ep.id}
                    className="flex items-baseline gap-3 rounded-sm px-2 py-1.5 text-sm odd:bg-void-raised"
                  >
                    <span className="font-mono text-xs text-portal">{ep.episode}</span>
                    <span className="truncate">{ep.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
