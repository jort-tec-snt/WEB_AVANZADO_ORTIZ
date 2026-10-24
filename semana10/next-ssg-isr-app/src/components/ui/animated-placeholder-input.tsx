"use client";

// Tomado de Aceternity UI "Placeholders And Vanish Input"
// (https://ui.aceternity.com/components/placeholders-and-vanish-input):
// se conserva la rotación animada de placeholders. El efecto "vanish" borra el texto
// al enviar, y eso no encaja con una búsqueda en vivo, así que se omite.

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedPlaceholderInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholders: string[];
  className?: string;
  intervalMs?: number;
}

export function AnimatedPlaceholderInput({
  value,
  onChange,
  placeholders,
  className,
  intervalMs = 2500,
}: AnimatedPlaceholderInputProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [placeholders.length, intervalMs]);

  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        className={cn("relative bg-transparent", className)}
      />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-3 right-8 flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.span
              key={index}
              initial={reduceMotion ? { opacity: 0 } : { y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { y: -12, opacity: 0 }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="truncate text-haze/60"
            >
              {placeholders[index]}…
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
