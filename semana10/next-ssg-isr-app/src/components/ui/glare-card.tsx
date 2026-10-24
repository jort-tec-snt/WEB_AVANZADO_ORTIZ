"use client";

// Adaptado de Aceternity UI "Glare Card" (https://ui.aceternity.com/components/glare-card):
// ancho fluido, radio del proyecto, sin console.log y sin rotación con movimiento reducido.

import { CSSProperties, ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlareCardProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  // "light": lámina más tenue y en multiply para que no lave las tarjetas claras
  tone?: "dark" | "light";
}

const containerStyle = {
  "--m-x": "50%",
  "--m-y": "50%",
  "--r-x": "0deg",
  "--r-y": "0deg",
  "--bg-x": "50%",
  "--bg-y": "50%",
  "--duration": "300ms",
  "--foil-size": "100%",
  "--opacity": "0",
  "--radius": "var(--radius-plate)",
  "--easing": "ease",
} as CSSProperties;

const foilStyle = {
  "--step": "5%",
  "--foil-svg": `url("data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.99994 3.419C2.99994 3.419 21.6142 7.43646 22.7921 12.153C23.97 16.8695 3.41838 23.0306 3.41838 23.0306' stroke='white' stroke-width='5' stroke-miterlimit='3.86874' stroke-linecap='round' style='mix-blend-mode:darken'/%3E%3C/svg%3E")`,
  "--pattern": "var(--foil-svg) center/100% no-repeat",
  "--rainbow":
    "repeating-linear-gradient( 0deg,rgb(255,119,115) calc(var(--step) * 1),rgba(255,237,95,1) calc(var(--step) * 2),rgba(168,255,95,1) calc(var(--step) * 3),rgba(131,255,247,1) calc(var(--step) * 4),rgba(120,148,255,1) calc(var(--step) * 5),rgb(216,117,255) calc(var(--step) * 6),rgb(255,119,115) calc(var(--step) * 7) ) 0% var(--bg-y)/200% 700% no-repeat",
  "--diagonal":
    "repeating-linear-gradient( 128deg,#0e152e 0%,hsl(180,10%,60%) 3.8%,hsl(180,10%,60%) 4.5%,hsl(180,10%,60%) 5.2%,#0e152e 10%,#0e152e 12% ) var(--bg-x) var(--bg-y)/300% no-repeat",
  "--shade":
    "radial-gradient( farthest-corner circle at var(--m-x) var(--m-y),rgba(255,255,255,0.1) 12%,rgba(255,255,255,0.15) 20%,rgba(255,255,255,0.25) 120% ) var(--bg-x) var(--bg-y)/300% no-repeat",
  backgroundBlendMode: "hue, hue, hue, overlay",
} as CSSProperties;

// En tarjetas claras las franjas oscuras del original ensucian el color: se aclaran
const lightFoilStyle = {
  ...foilStyle,
  "--diagonal":
    "repeating-linear-gradient( 128deg,#ffffff 0%,hsl(180,30%,85%) 3.8%,hsl(180,30%,85%) 4.5%,hsl(180,30%,85%) 5.2%,#ffffff 10%,#ffffff 12% ) var(--bg-x) var(--bg-y)/300% no-repeat",
} as CSSProperties;

export function GlareCard({ children, className, containerClassName, tone = "dark" }: GlareCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isPointerInside = useRef(false);

  function setVars(vars: Record<string, string>) {
    for (const [key, value] of Object.entries(vars)) {
      ref.current?.style.setProperty(key, value);
    }
  }

  return (
    <div
      ref={ref}
      style={containerStyle}
      className={cn(
        "relative isolate w-full transition-transform duration-[var(--duration)] ease-[var(--easing)] will-change-transform [contain:layout_style] [perspective:600px]",
        containerClassName,
      )}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const pctX = (100 / rect.width) * (event.clientX - rect.left);
        const pctY = (100 / rect.height) * (event.clientY - rect.top);
        const rotateFactor = 0.4;

        setVars({
          "--bg-x": `${50 + pctX / 4 - 12.5}%`,
          "--bg-y": `${50 + pctY / 3 - 16.67}%`,
          "--r-x": `${-((pctX - 50) / 3.5) * rotateFactor}deg`,
          "--r-y": `${((pctY - 50) / 2) * rotateFactor}deg`,
          "--m-x": `${pctX}%`,
          "--m-y": `${pctY}%`,
        });
      }}
      onPointerEnter={() => {
        isPointerInside.current = true;
        setTimeout(() => {
          if (isPointerInside.current) ref.current?.style.setProperty("--duration", "0s");
        }, 300);
      }}
      onPointerLeave={() => {
        isPointerInside.current = false;
        ref.current?.style.removeProperty("--duration");
        setVars({ "--r-x": "0deg", "--r-y": "0deg" });
      }}
    >
      <div
        className={cn(
          "grid h-full origin-center overflow-hidden rounded-[var(--radius)] transition-transform duration-[var(--duration)] ease-[var(--easing)] will-change-transform [transform:rotateY(var(--r-x))_rotateX(var(--r-y))] hover:[--duration:200ms] hover:[--easing:linear] motion-reduce:[transform:none]",
          tone === "light" ? "hover:[--opacity:0.7]" : "hover:[--opacity:0.6]",
        )}
      >
        <div className="grid h-full w-full [clip-path:inset(0_0_0_0_round_var(--radius))] [grid-area:1/1]">
          <div className={cn("h-full w-full", className)}>{children}</div>
        </div>
        {/* Brillo que sigue al puntero */}
        <div className="pointer-events-none grid h-full w-full opacity-[var(--opacity)] mix-blend-soft-light transition-opacity duration-[var(--duration)] ease-[var(--easing)] [background:radial-gradient(farthest-corner_circle_at_var(--m-x)_var(--m-y),_rgba(255,255,255,0.8)_10%,_rgba(255,255,255,0.65)_20%,_rgba(255,255,255,0)_90%)] [clip-path:inset(0_0_1px_0_round_var(--radius))] [grid-area:1/1]" />
        {/* Lámina holográfica */}
        <div
          className={cn(
            "pointer-events-none relative grid h-full w-full opacity-[var(--opacity)] transition-opacity",
            tone === "light" ? "mix-blend-multiply" : "mix-blend-color-dodge",
            "[background-blend-mode:hue_hue_hue_overlay] [background:var(--pattern),_var(--rainbow),_var(--diagonal),_var(--shade)] [clip-path:inset(0_0_1px_0_round_var(--radius))] [grid-area:1/1] after:bg-[inherit] after:mix-blend-exclusion after:content-[''] after:[background-blend-mode:soft-light,_hue,_hard-light] after:[background-position:center,_0%_var(--bg-y),_calc(var(--bg-x)*_-1)_calc(var(--bg-y)*_-1),_var(--bg-x)_var(--bg-y)] after:[background-size:var(--foil-size),_200%_400%,_800%,_200%]",
          )}
          style={tone === "light" ? lightFoilStyle : foilStyle}
        />
      </div>
    </div>
  );
}
