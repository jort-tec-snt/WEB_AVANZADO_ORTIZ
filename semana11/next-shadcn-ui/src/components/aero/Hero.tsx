"use client";

import Image from "next/image";
import { useRef } from "react";

/** Cabecera con agua turquesa, brillo que barre y una hoja que flota con paralaje. */
export function Hero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  const move = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--hx", String(((e.clientX - r.left) / r.width - 0.5) * 2));
    el.style.setProperty("--hy", String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };
  const leave = () => {
    ref.current?.style.setProperty("--hx", "0");
    ref.current?.style.setProperty("--hy", "0");
  };

  return (
    <section ref={ref} onPointerMove={move} onPointerLeave={leave} className="aero-hero">
      <div className="aero-hero__clip">
        <div className="aero-hero__water" />
        <div className="aero-hero__shine" />
        <div className="aero-hero__body">
          <p className="aero-hero__eyebrow">{eyebrow}</p>
          <h1 className="aero-hero__title">{title}</h1>
          <p className="aero-hero__subtitle">{subtitle}</p>
          {children ? <div className="aero-hero__actions">{children}</div> : null}
        </div>
      </div>
      <Image
        src="/aero/leaf.webp"
        alt=""
        width={909}
        height={900}
        unoptimized
        priority
        className="aero-hero__leaf"
      />
    </section>
  );
}
