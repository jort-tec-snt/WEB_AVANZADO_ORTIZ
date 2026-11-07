"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Notice {
  id: number;
  title: string;
  description?: string;
  variant: "success" | "destructive";
}

const NoticeContext = createContext<{ notify: (n: Omit<Notice, "id">) => void } | null>(null);

/** Avisos efímeros (tipo toast) construidos con el componente Alert de shadcn/ui. */
export function NoticeProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Notice[]>([]);

  const notify = useCallback((n: Omit<Notice, "id">) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { ...n, id }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 4200);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NoticeContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
        {items.map((n) => (
          <Alert key={n.id} variant={n.variant} className="aero-rise pointer-events-auto shadow-lg backdrop-blur">
            {n.variant === "success" ? <CheckCircle2Icon /> : <AlertCircleIcon />}
            <AlertTitle>{n.title}</AlertTitle>
            {n.description ? <AlertDescription>{n.description}</AlertDescription> : null}
          </Alert>
        ))}
      </div>
    </NoticeContext.Provider>
  );
}

export function useNotice() {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error("useNotice debe usarse dentro de <NoticeProvider>");
  return ctx;
}
