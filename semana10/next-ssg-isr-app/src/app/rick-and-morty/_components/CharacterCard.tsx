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
      className="group flex h-full flex-col overflow-hidden rounded-plate border border-hull bg-void-raised transition hover:-translate-y-1 hover:border-portal"
    >
      <div className="relative aspect-square overflow-hidden border-b border-hull">
        <Image
          src={character.image}
          alt={character.name}
          width={300}
          height={300}
          sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw"
          className="size-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy" // Lazy loading: se descarga al acercarse al viewport
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
