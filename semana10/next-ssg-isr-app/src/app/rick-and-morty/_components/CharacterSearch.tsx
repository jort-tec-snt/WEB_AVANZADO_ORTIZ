"use client"; // CSR: la búsqueda se ejecuta en el navegador

import { useEffect, useState } from "react";
import { Character, CharacterListResponse } from "@/types/rick-and-morty";
import { RM_API, genderLabel, statusLabel } from "@/lib/rick-and-morty";
import { SpotlightGrid } from "@/components/ui/spotlight-grid";
import { AnimatedPlaceholderInput } from "@/components/ui/animated-placeholder-input";
import CharacterCard from "./CharacterCard";

const NAME_PLACEHOLDERS = [
  "Rick Sanchez",
  "Birdperson",
  "Mr. Meeseeks",
  "Pickle Rick",
  "Squanchy",
  "Evil Morty",
];

interface Filters {
  name: string;
  status: string;
  type: string;
  gender: string;
}

const EMPTY_FILTERS: Filters = { name: "", status: "", type: "", gender: "" };

const DEBOUNCE_MS = 400;

function buildUrl(filters: Filters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value.trim()) params.set(key, value.trim());
  }
  return `${RM_API}/character/?${params}`;
}

async function fetchPage(url: string, signal?: AbortSignal): Promise<CharacterListResponse | null> {
  const res = await fetch(url, { signal });
  if (res.status === 404) return null; // La API responde 404 cuando no hay coincidencias
  if (res.status === 429) throw new Error("Demasiadas búsquedas seguidas. Espera unos segundos.");
  if (!res.ok) throw new Error("No se pudo consultar la API de Rick and Morty.");
  return res.json();
}

const fieldClass =
  "w-full rounded-plate border border-hull bg-void px-3 py-2.5 text-glow placeholder:text-haze/60 transition-colors hover:border-hull-bright focus:border-portal focus:outline-none";

export default function CharacterSearch() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [results, setResults] = useState<Character[]>([]);
  const [total, setTotal] = useState(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cada cambio de filtros dispara una búsqueda tras una pausa (debounce);
  // la limpieza cancela el temporizador y la petición anterior si el usuario sigue escribiendo.
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPage(buildUrl(filters), controller.signal);
        setResults(data?.results ?? []);
        setTotal(data?.info.count ?? 0);
        setNextUrl(data?.info.next ?? null);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Error inesperado.");
        setResults([]);
        setTotal(0);
        setNextUrl(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters]);

  async function loadMore() {
    if (!nextUrl) return;
    setLoadingMore(true);
    try {
      const data = await fetchPage(nextUrl);
      setResults((prev) => [...prev, ...(data?.results ?? [])]);
      setNextUrl(data?.info.next ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoadingMore(false);
    }
  }

  function update(field: keyof Filters, value: string) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  const hasFilters = Object.values(filters).some((v) => v.trim() !== "");

  return (
    <div>
      {/* El borde se convierte en un portal que gira mientras se busca */}
      <div className="portal-ring-focus">
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="grid gap-4 rounded-[5px] bg-void-raised p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end"
        >
          <label className="grid gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-haze">Nombre</span>
            <AnimatedPlaceholderInput
              value={filters.name}
              onChange={(value) => update("name", value)}
              placeholders={NAME_PLACEHOLDERS}
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-haze">Estado</span>
            <select
              value={filters.status}
              onChange={(e) => update("status", e.target.value)}
              className={fieldClass}
            >
              <option value="">Todos</option>
              {Object.entries(statusLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-haze">Tipo</span>
            <input
              type="text"
              value={filters.type}
              onChange={(e) => update("type", e.target.value)}
              placeholder="Parasite, Clone…"
              autoComplete="off"
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-haze">Género</span>
            <select
              value={filters.gender}
              onChange={(e) => update("gender", e.target.value)}
              className={fieldClass}
            >
              <option value="">Todos</option>
              {Object.entries(genderLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setFilters(EMPTY_FILTERS)}
            disabled={!hasFilters}
            className="rounded-plate border border-hull-bright px-4 py-2.5 font-semibold transition hover:border-portal hover:text-portal disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-hull-bright disabled:hover:text-glow"
          >
            Limpiar
          </button>
        </form>
      </div>

      <p aria-live="polite" className="mt-6 mb-4 font-mono text-xs uppercase tracking-widest text-haze">
        {loading
          ? "Escaneando el multiverso…"
          : error
            ? ""
            : `${total} ${total === 1 ? "coincidencia" : "coincidencias"}`}
      </p>

      {error && (
        <p role="alert" className="rounded-plate border border-dead/60 bg-dead/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="rounded-plate border border-dashed border-hull-bright px-6 py-12 text-center">
          <p className="text-lg font-bold">Ningún personaje coincide</p>
          <p className="mt-1 text-haze">Prueba con otro nombre o quita algún filtro.</p>
        </div>
      )}

      <SpotlightGrid
        className={`grid grid-cols-2 gap-4 transition-opacity sm:grid-cols-3 lg:grid-cols-5 ${loading ? "opacity-40" : ""}`}
      >
        {results.map((character) => (
          <li key={character.id}>
            <CharacterCard character={character} />
          </li>
        ))}
      </SpotlightGrid>

      {nextUrl && !loading && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-plate bg-portal px-6 py-3 font-bold text-void transition hover:bg-glow disabled:cursor-wait disabled:opacity-60"
          >
            {loadingMore ? "Cargando…" : `Cargar más (${results.length} de ${total})`}
          </button>
        </div>
      )}
    </div>
  );
}
