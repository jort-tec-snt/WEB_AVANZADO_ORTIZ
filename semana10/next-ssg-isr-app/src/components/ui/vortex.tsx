"use client";

// Adaptado de Aceternity UI "Vortex" (https://ui.aceternity.com/components/vortex):
// el canvas toma el tamaño de su contenedor (no de la ventana), la paleta es configurable
// y no se anima si el usuario pide movimiento reducido.

import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface VortexProps {
  className?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  rangeHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

const PROPS_PER_PARTICLE = 9; // x, y, vx, vy, life, ttl, speed, radius, hue
const BASE_TTL = 50;
const RANGE_TTL = 150;
const NOISE_STEPS = 3;
const X_OFF = 0.00125;
const Y_OFF = 0.00125;
const Z_OFF = 0.0005;
const TAU = 2 * Math.PI;

const rand = (n: number) => n * Math.random();
const randRange = (n: number) => n - rand(2 * n);
const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;
const fadeInOut = (t: number, m: number) => {
  const hm = 0.5 * m;
  return Math.abs(((t + hm) % m) - hm) / hm;
};

export function Vortex({
  className,
  particleCount = 500,
  rangeY = 100,
  baseHue = 220,
  rangeHue = 100,
  baseSpeed = 0,
  rangeSpeed = 1.5,
  baseRadius = 1,
  rangeRadius = 2,
  backgroundColor = "#000000",
}: VortexProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!container || !canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const noise3D = createNoise3D();
    const length = particleCount * PROPS_PER_PARTICLE;
    const particles = new Float32Array(length);
    let centerY = 0;
    let tick = 0;
    let frame = 0;

    const initParticle = (i: number) => {
      particles.set(
        [
          rand(canvas.width),
          centerY + randRange(rangeY),
          0,
          0,
          0,
          BASE_TTL + rand(RANGE_TTL),
          baseSpeed + rand(rangeSpeed),
          baseRadius + rand(rangeRadius),
          baseHue + rand(rangeHue),
        ],
        i,
      );
    };

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      centerY = 0.5 * canvas.height;
    };

    const updateParticle = (i: number) => {
      const x = particles[i];
      const y = particles[i + 1];
      const n = noise3D(x * X_OFF, y * Y_OFF, tick * Z_OFF) * NOISE_STEPS * TAU;
      const vx = lerp(particles[i + 2], Math.cos(n), 0.5);
      const vy = lerp(particles[i + 3], Math.sin(n), 0.5);
      const life = particles[i + 4];
      const ttl = particles[i + 5];
      const speed = particles[i + 6];
      const x2 = x + vx * speed;
      const y2 = y + vy * speed;

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineWidth = particles[i + 7];
      ctx.strokeStyle = `hsla(${particles[i + 8]},100%,60%,${fadeInOut(life, ttl)})`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();

      particles[i] = x2;
      particles[i + 1] = y2;
      particles[i + 2] = vx;
      particles[i + 3] = vy;
      particles[i + 4] = life + 1;

      const outOfBounds = x2 > canvas.width || x2 < 0 || y2 > canvas.height || y2 < 0;
      if (outOfBounds || life + 1 > ttl) initParticle(i);
    };

    const glow = (filter: string) => {
      ctx.save();
      ctx.filter = filter;
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    };

    const draw = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Con "lighter" + brillo, un fondo no negro se aclara en cada pasada;
      // "transparent" deja ver el fondo del contenedor y solo brillan las partículas.
      if (backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      for (let i = 0; i < length; i += PROPS_PER_PARTICLE) updateParticle(i);
      glow("blur(8px) brightness(200%)");
      glow("blur(4px) brightness(200%)");
      glow("none");
      frame = requestAnimationFrame(draw);
    };

    resize();
    for (let i = 0; i < length; i += PROPS_PER_PARTICLE) initParticle(i);
    draw();

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [particleCount, rangeY, baseHue, rangeHue, baseSpeed, rangeSpeed, baseRadius, rangeRadius, backgroundColor]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <canvas ref={canvasRef} className="block size-full" />
    </motion.div>
  );
}
