import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Une clases condicionales y resuelve conflictos de Tailwind (convención de Aceternity UI)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
