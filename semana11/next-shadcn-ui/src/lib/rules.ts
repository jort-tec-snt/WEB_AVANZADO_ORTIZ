import type { Member, Project } from "./types";

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

export type FieldErrors = Record<string, string>;

export type ProjectDraft = Omit<Project, "id">;
export type MemberDraft = Omit<Member, "userId">;

export function validateProject(d: ProjectDraft, memberIds: string[]): FieldErrors {
  const e: FieldErrors = {};
  const title = required(d.title, "El nombre") ?? minLen(d.title, 3, "El nombre");
  if (title) e.title = title;
  else if (d.title.trim().length > 60) e.title = "El nombre no puede superar los 60 caracteres";
  if (d.description.trim().length > 140) e.description = "La descripción no puede superar los 140 caracteres";
  if (!d.category) e.category = "Selecciona una categoría";
  if (!d.priority) e.priority = "Selecciona la prioridad";
  if (!d.status) e.status = "Selecciona el estado";
  if (memberIds.length === 0) e.members = "Asigna al menos un miembro al proyecto";
  return e;
}

export function validateMember(d: MemberDraft, others: Member[]): FieldErrors {
  const e: FieldErrors = {};
  const name = required(d.name, "El nombre") ?? minLen(d.name, 3, "El nombre");
  if (name) e.name = name;
  if (!d.email.trim()) e.email = "El correo es obligatorio";
  else if (!EMAIL_RE.test(d.email.trim())) e.email = "Ingresa un correo válido (ej. nombre@dominio.com)";
  else if (others.some((m) => m.email.toLowerCase() === d.email.trim().toLowerCase())) e.email = "Ya existe un miembro con ese correo";
  if (!d.role) e.role = "Selecciona un rol";
  const position = required(d.position, "El cargo");
  if (position) e.position = position;
  const born = parseISO(d.birthdate);
  if (!born) e.birthdate = "Selecciona la fecha de nacimiento";
  else if (born > new Date()) e.birthdate = "La fecha de nacimiento no puede ser futura";
  else {
    const limit = new Date();
    limit.setFullYear(limit.getFullYear() - 16);
    if (born > limit) e.birthdate = "El miembro debe tener al menos 16 años";
  }
  if (!d.phone.trim()) e.phone = "El teléfono es obligatorio";
  else if (!PHONE_RE.test(d.phone.trim())) e.phone = "Teléfono inválido (7 a 15 dígitos, puede incluir +51)";
  return e;
}
