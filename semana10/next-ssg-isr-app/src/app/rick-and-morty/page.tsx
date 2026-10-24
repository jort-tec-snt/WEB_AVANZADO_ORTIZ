import { Character, CharacterListResponse } from "@/types/rick-and-morty";
import { RM_API, statusLabel } from "@/lib/rick-and-morty";
import { SpotlightGrid } from "@/components/ui/spotlight-grid";
import { Vortex } from "@/components/ui/vortex";
import CharacterCard from "./_components/CharacterCard";

// SSG: `force-cache` guarda la respuesta en la caché de datos de Next.js.
// Como la página no usa datos de la petición (cookies, headers, searchParams),
// el componente de servidor se renderiza una sola vez en el build y se sirve como HTML estático.
async function getCharacterCount(): Promise<number> {
  const res = await fetch(`${RM_API}/character`, { cache: "force-cache" });
  if (!res.ok) throw new Error("Error al consultar la API de Rick and Morty");
  const data: CharacterListResponse = await res.json();
  return data.info.count;
}

async function getAllCharacters(): Promise<Character[]> {
  const count = await getCharacterCount();
  const ids = Array.from({ length: count }, (_, i) => i + 1).join(",");

  // Endpoint múltiple: /character/1,2,3,... devuelve todos en una sola petición
  const res = await fetch(`${RM_API}/character/${ids}`, { cache: "force-cache" });
  if (!res.ok) throw new Error("Error al cargar los personajes");
  return res.json();
}

export default async function CharactersPage() {
  const characters = await getAllCharacters();
  const alive = characters.filter((c) => c.status === "Alive").length;
  const dead = characters.filter((c) => c.status === "Dead").length;

  return (
    <main className="px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="relative isolate mb-10 grid gap-6 border-b border-hull pt-4 pb-8 md:grid-cols-[1fr_auto] md:items-end">
          {/* Vortex: el encabezado se abre como un portal */}
          <Vortex
            className="-z-10 -mx-4 [mask-image:linear-gradient(90deg,transparent,black_45%,black_80%,transparent)] sm:-mx-8"
            backgroundColor="transparent"
            baseHue={78}
            rangeHue={40}
            particleCount={260}
            rangeY={70}
          />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-portal">
              SSG · cache: force-cache
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Personajes
            </h1>
            <p className="mt-3 max-w-xl text-haze">
              Registro completo de habitantes del multiverso. Cada ficha se genera de
              forma estática y se revalida cada 10 días.
            </p>
          </div>
          <dl className="grid grid-cols-3 divide-x divide-hull rounded-plate border border-hull bg-void/80 font-mono backdrop-blur-sm">
            <div className="px-4 py-3">
              <dt className="text-[11px] uppercase tracking-wide text-haze">Total</dt>
              <dd className="text-2xl font-bold">{characters.length}</dd>
            </div>
            <div className="px-4 py-3">
              <dt className="text-[11px] uppercase tracking-wide text-haze">{statusLabel.Alive}s</dt>
              <dd className="text-2xl font-bold text-alive">{alive}</dd>
            </div>
            <div className="px-4 py-3">
              <dt className="text-[11px] uppercase tracking-wide text-haze">{statusLabel.Dead}s</dt>
              <dd className="text-2xl font-bold text-dead">{dead}</dd>
            </div>
          </dl>
        </header>

        <SpotlightGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {characters.map((character) => (
            <li key={character.id}>
              <CharacterCard character={character} />
            </li>
          ))}
        </SpotlightGrid>
      </div>
    </main>
  );
}
