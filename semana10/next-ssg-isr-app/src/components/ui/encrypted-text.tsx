"use client";

// Adaptado de Aceternity UI "Encrypted Text" (https://ui.aceternity.com/components/encrypted-text).
// El original genera caracteres aleatorios durante el render, lo que en Next.js provoca
// un error de hidratación y deja el texto revuelto sin JavaScript. Aquí el HTML del servidor
// trae el texto real y el efecto corre solo en el navegador (y no corre con movimiento reducido).

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface EncryptedTextProps {
  text: string;
  className?: string;
  revealDelayMs?: number; // ms entre cada carácter revelado
  flipDelayMs?: number; // ms entre cada cambio de los caracteres aún cifrados
  charset?: string;
  encryptedClassName?: string;
  revealedClassName?: string;
}

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>/?";

const randomChar = (charset: string) => charset.charAt(Math.floor(Math.random() * charset.length));

export function EncryptedText({
  text,
  className,
  revealDelayMs = 45,
  flipDelayMs = 50,
  charset = DEFAULT_CHARSET,
  encryptedClassName,
  revealedClassName,
}: EncryptedTextProps) {
  // En el servidor y en el primer render se muestra todo revelado
  const [revealCount, setRevealCount] = useState(text.length);
  const [scramble, setScramble] = useState<string[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let start = 0;
    let lastFlip = 0;

    const update = (now: number) => {
      if (!start) {
        start = now;
        lastFlip = now;
      }
      const count = Math.min(text.length, Math.floor((now - start) / Math.max(1, revealDelayMs)));
      setRevealCount(count);

      if (now - lastFlip >= flipDelayMs || count === 0) {
        setScramble(text.split("").map((ch) => (ch === " " ? " " : randomChar(charset))));
        lastFlip = now;
      }

      if (count < text.length) frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameRef.current);
  }, [text, revealDelayMs, flipDelayMs, charset]);

  return (
    <span className={cn(className)} aria-label={text}>
      {text.split("").map((char, index) => {
        const revealed = index >= scramble.length || index < revealCount;
        return (
          <span
            key={index}
            aria-hidden
            className={cn(revealed ? revealedClassName : encryptedClassName)}
          >
            {revealed ? char : scramble[index]}
          </span>
        );
      })}
    </span>
  );
}
