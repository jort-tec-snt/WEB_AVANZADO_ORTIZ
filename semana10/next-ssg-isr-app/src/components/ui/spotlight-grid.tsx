"use client";

// Versión ligera de Aceternity UI "Card Spotlight" (https://ui.aceternity.com/components/card-spotlight).
// El original monta un canvas de three.js por tarjeta; aquí un solo listener en la grilla
// mueve un foco radial (CSS) dentro de la tarjeta bajo el puntero. Las tarjetas marcan
// su contenedor con `data-spotlight` y pintan el foco con la clase `.spotlight`.

import { ReactNode } from "react";

interface SpotlightGridProps {
  children: ReactNode;
  className?: string;
}

export function SpotlightGrid({ children, className }: SpotlightGridProps) {
  return (
    <ul
      className={className}
      onPointerMove={(event) => {
        const card = (event.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
      }}
    >
      {children}
    </ul>
  );
}
