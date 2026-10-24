import Link from "next/link";
import Image from "next/image";
import { Character } from "@/types/rick-and-morty";
import { statusDot, statusLabel } from "@/lib/rick-and-morty";

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link
      href={`/rick-and-morty/${character.id}`}
      data-spotlight
      className="group relative flex h-full flex-col overflow-hidden rounded-plate border border-hull bg-void-raised transition hover:-translate-y-1 hover:border-portal hover:shadow-[0_0_0_1px_var(--color-portal),0_12px_32px_-12px_color-mix(in_srgb,var(--color-portal)_45%,transparent)] motion-reduce:hover:translate-y-0"
    >
      {/* Card Spotlight: lo mueve SpotlightGrid con la posición del puntero */}
      <span aria-hidden className="spotlight" />
      <div className="relative aspect-square overflow-hidden border-b border-hull">
        <Image
          src={character.image}
          alt={character.name}
          width={300}
          height={300}
          className="size-full object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none"
          loading="lazy" // Lazy loading: se descarga al acercarse al viewport
          // Los avatares ya son JPEG de 300×300. Sin optimizar, el navegador los pide directo
          // a la API: se evita el HTTP 429 que recibía el optimizador del servidor.
          unoptimized
        />
        <span className="absolute top-2 left-2 rounded-sm bg-void/85 px-1.5 py-0.5 font-mono text-[11px] text-haze">
          #{character.id.toString().padStart(3, "0")}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h2 className="line-clamp-2 font-bold leading-tight text-glow transition-colors group-hover:text-portal">
          {character.name}
        </h2>
        <p className="flex items-center gap-1.5 text-sm text-haze">
          <span aria-hidden className={`size-2 shrink-0 rounded-full ${statusDot[character.status]}`} />
          {statusLabel[character.status]} · {character.species}
        </p>
        <p className="mt-auto truncate pt-2 font-mono text-[11px] uppercase tracking-wide text-haze/80">
          {character.location.name}
        </p>
      </div>
    </Link>
  );
}
