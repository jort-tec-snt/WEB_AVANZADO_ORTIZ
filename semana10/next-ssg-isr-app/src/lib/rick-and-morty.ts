import { CharacterGender, CharacterStatus } from "@/types/rick-and-morty";

export const RM_API = "https://rickandmortyapi.com/api";

// 10 días en segundos (ISR del detalle)
export const TEN_DAYS = 60 * 60 * 24 * 10;

export const statusLabel: Record<CharacterStatus, string> = {
  Alive: "Vivo",
  Dead: "Muerto",
  unknown: "Desconocido",
};

export const statusDot: Record<CharacterStatus, string> = {
  Alive: "bg-alive",
  Dead: "bg-dead",
  unknown: "bg-unknown",
};

export const genderLabel: Record<CharacterGender, string> = {
  Female: "Femenino",
  Male: "Masculino",
  Genderless: "Sin género",
  unknown: "Desconocido",
};

// "https://rickandmortyapi.com/api/episode/28" -> 28
export function idFromUrl(url: string): number | null {
  const id = Number(url.split("/").pop());
  return Number.isInteger(id) && id > 0 ? id : null;
}
