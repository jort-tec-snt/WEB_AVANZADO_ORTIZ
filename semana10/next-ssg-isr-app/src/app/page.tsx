import Link from "next/link";

const sections = [
  {
    href: "/pokemon",
    eyebrow: "Ejercicio 1 · PokeAPI",
    title: "Pokédex",
    description: "Los 151 Pokémon de Kanto con fichas generadas en el build.",
    routes: [
      { path: "/pokemon", strategy: "ISR · 24 h" },
      { path: "/pokemon/[name]", strategy: "SSG + ISR · 151 rutas" },
    ],
    cta: "Abrir la Pokédex",
    theme: {
      panel: "bg-paper text-ink",
      eyebrow: "text-dex",
      muted: "text-ink-soft",
      rule: "border-ink/20",
      cta: "bg-dex text-paper group-hover:bg-ink",
    },
  },
  {
    href: "/rick-and-morty",
    eyebrow: "Tarea · Rick and Morty API",
    title: "Expediente Rick and Morty",
    description: "826 personajes, fichas con revalidación y búsqueda en tiempo real.",
    routes: [
      { path: "/rick-and-morty", strategy: "SSG · force-cache" },
      { path: "/rick-and-morty/[id]", strategy: "SSG + ISR · 10 días" },
      { path: "/rick-and-morty/search", strategy: "CSR" },
    ],
    cta: "Abrir el expediente",
    theme: {
      panel: "theme-portal bg-void text-glow",
      eyebrow: "text-portal",
      muted: "text-haze",
      rule: "border-hull",
      cta: "bg-portal text-void group-hover:bg-glow",
    },
  },
];

export default function Home() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      {sections.map((section) => (
        <Link
          key={section.href}
          href={section.href}
          className={`group flex flex-col justify-between gap-12 px-6 py-10 sm:px-12 sm:py-14 ${section.theme.panel}`}
        >
          <p className={`font-mono text-[11px] uppercase tracking-widest ${section.theme.muted}`}>
            Laboratorio 10 · Next.js SSG e ISR
          </p>

          <div>
            <p className={`font-mono text-xs uppercase tracking-widest ${section.theme.eyebrow}`}>
              {section.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              {section.title}
            </h1>
            <p className={`mt-4 max-w-md text-lg ${section.theme.muted}`}>
              {section.description}
            </p>

            <dl className={`mt-8 max-w-md border-t ${section.theme.rule}`}>
              {section.routes.map((route) => (
                <div
                  key={route.path}
                  className={`flex items-baseline justify-between gap-4 border-b py-2.5 ${section.theme.rule}`}
                >
                  <dt className="font-mono text-sm">{route.path}</dt>
                  <dd className={`text-right font-mono text-xs uppercase tracking-wide ${section.theme.muted}`}>
                    {route.strategy}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <span
            className={`self-start rounded-plate px-5 py-3 font-bold transition-colors ${section.theme.cta}`}
          >
            {section.cta} →
          </span>
        </Link>
      ))}
    </main>
  );
}
