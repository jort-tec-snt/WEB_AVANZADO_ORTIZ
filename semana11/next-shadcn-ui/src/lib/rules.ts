// Reglas de validación compartidas por todos los formularios (una sola fuente).
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^\+?[0-9][0-9\s-]{6,16}$/;

export type Errors<T> = Partial<Record<keyof T, string>>;

export const required = (v: string, label: string) => (v.trim() ? undefined : `${label} es obligatorio`);

export function minLen(v: string, n: number, label: string) {
  return v.trim().length >= n ? undefined : `${label} debe tener al menos ${n} caracteres`;
}

export function isoToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** yyyy-mm-dd <-> Date en hora local (evita el desfase de zona horaria de new Date("yyyy-mm-dd")). */
export function parseISO(iso: string): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : undefined;
}
export function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function formatDate(iso: string) {
  const d = parseISO(iso);
  return d ? d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }) : "—";
}
