"use client";

import { useEffect, useRef } from "react";

/**
 * Escenario fijo detrás de toda la app: cielo con paralaje y dos capas de burbujas
 * a distinta profundidad. Solo se mueve con el puntero (y se desactiva con
 * prefers-reduced-motion).
 */
export function AeroBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", String((e.clientX / window.innerWidth - 0.5) * 2));
        el.style.setProperty("--py", String((e.clientY / window.innerHeight - 0.5) * 2));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="aero-stage">
      <div className="aero-sky" />
      <div className="aero-sun" />
      <div className="aero-layer aero-layer--far">
        <span className="aero-drift aero-drift--a" />
      </div>
      <div className="aero-layer aero-layer--near">
        <span className="aero-drift aero-drift--b" />
      </div>
    </div>
  );
}
