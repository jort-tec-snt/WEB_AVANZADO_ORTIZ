"use client";

// Inspirado en Aceternity UI "3D Card Effect" (https://ui.aceternity.com/components/3d-card-effect):
// el contenido se inclina en perspectiva siguiendo al puntero y vuelve a su sitio al salir.

import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // grados
}

export function TiltCard({ children, className, maxTilt = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function reset() {
    ref.current?.style.setProperty("--tilt-x", "0deg");
    ref.current?.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div
      className="[perspective:1000px]"
      onPointerMove={(event) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        ref.current?.style.setProperty("--tilt-x", `${-y * maxTilt}deg`);
        ref.current?.style.setProperty("--tilt-y", `${x * maxTilt}deg`);
      }}
      onPointerLeave={reset}
    >
      <div
        ref={ref}
        className={cn(
          "transition-transform duration-200 ease-out [transform-style:preserve-3d] [transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Capa que "flota" sobre la tarjeta inclinada (equivale a CardItem translateZ)
export function TiltLayer({
  children,
  className,
  depth = 40,
}: {
  children: ReactNode;
  className?: string;
  depth?: number;
}) {
  return (
    <div className={className} style={{ transform: `translateZ(${depth}px)` }}>
      {children}
    </div>
  );
}
