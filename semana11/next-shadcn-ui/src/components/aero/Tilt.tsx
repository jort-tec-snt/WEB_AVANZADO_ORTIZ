"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Contenedor 3D: inclina su contenido hacia el puntero con perspectiva y pasa un brillo
 * ("glare") que sigue al cursor. Los hijos con .aero-pop quedan elevados en el eje Z.
 */
export function Tilt({
  children,
  className,
  max = 8,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - y) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    el.dataset.active = "true";
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    delete el.dataset.active;
  };

  return (
    <div className="aero-tilt-wrap">
      <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={cn("aero-tilt", className)}>
        {children}
        <span aria-hidden className="aero-glare" />
      </div>
    </div>
  );
}
