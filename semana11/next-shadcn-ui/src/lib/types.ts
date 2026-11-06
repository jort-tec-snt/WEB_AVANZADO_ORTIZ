export const PROJECT_STATUSES = ["Planificado", "En progreso", "En revisión", "Completado"] as const;
export const PROJECT_CATEGORIES = ["Desarrollo Web", "Desarrollo Mobile", "Diseño", "Marketing", "Otro"] as const;
export const TASK_STATUSES = ["Pendiente", "En progreso", "Completado"] as const;
export const PRIORITIES = ["Baja", "Media", "Alta", "Urgente"] as const;
export const MEMBER_ROLES = ["Administrador", "Líder de proyecto", "Desarrollador", "Diseñador", "Analista"] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type MemberRole = (typeof MEMBER_ROLES)[number];

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  priority: Priority;
  status: ProjectStatus;
}

/** Campos pedidos en la guía: userId, role, name, email, position, birthdate, phone, projectId, isActive */
export interface Member {
  userId: string;
  role: MemberRole;
  name: string;
  email: string;
  position: string;
  birthdate: string; // yyyy-mm-dd
  phone: string;
  projectId: string | null;
  isActive: boolean;
}

/** Campos pedidos en la guía: description, projectId, status, priority, userId, dateline */
export interface Task {
  id: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: Priority;
  userId: string | null;
  dateline: string; // yyyy-mm-dd
}

export interface Settings {
  displayName: string;
  email: string;
  language: "es" | "en" | "pt";
  timezone: string;
  defaultPriority: Priority;
  workdayStart: string;
  workdayEnd: string;
  emailNotifications: boolean;
  weeklyDigest: boolean;
  autoArchive: boolean;
  compactMode: boolean;
}
