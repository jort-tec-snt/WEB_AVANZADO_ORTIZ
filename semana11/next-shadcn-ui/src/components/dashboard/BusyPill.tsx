"use client";

import { Spinner } from "@/components/ui/spinner";
import { useData } from "@/lib/data-context";

/** Indicador global mientras hay una petición simulada al "backend". */
export function BusyPill() {
  const { busy } = useData();
  if (!busy) return null;
  return (
    <div role="status" className="aero-glass aero-rise fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-primary">
      <Spinner /> Sincronizando con el servidor…
    </div>
  );
}
