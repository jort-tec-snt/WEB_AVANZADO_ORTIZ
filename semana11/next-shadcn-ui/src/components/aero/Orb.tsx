import Image from "next/image";
import { cn } from "@/lib/utils";

export type OrbColor = "aqua" | "leaf" | "sky" | "lime";

/** Esfera de cristal decorativa que flota. Va dentro de un <Tilt> para ganar profundidad. */
export function Orb({
  color,
  size = 88,
  delay = 0,
  className,
}: {
  color: OrbColor;
  size?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={cn("aero-pop", className)} style={{ width: size, height: size }}>
      <Image
        src={`/aero/orb-${color}.webp`}
        alt=""
        width={512}
        height={512}
        unoptimized
        className="aero-orb"
        style={{ animationDelay: `${delay}s` }}
      />
    </div>
  );
}
