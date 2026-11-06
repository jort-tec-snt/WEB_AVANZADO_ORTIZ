import type { Member, Project, Settings, Task } from "./types";

export const seedProjects: Project[] = [
  { id: "P-001", title: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", category: "Desarrollo Web", priority: "Alta", status: "En progreso" },
  { id: "P-002", title: "Mobile App", description: "Aplicación móvil con React Native", category: "Desarrollo Mobile", priority: "Media", status: "En revisión" },
  { id: "P-003", title: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", category: "Desarrollo Web", priority: "Media", status: "Planificado" },
  { id: "P-004", title: "API Gateway", description: "Microservicios con Node.js", category: "Desarrollo Web", priority: "Alta", status: "En progreso" },
  { id: "P-005", title: "Design System", description: "Librería de componentes reutilizables", category: "Diseño", priority: "Baja", status: "Completado" },
  { id: "P-006", title: "Marketing Website", description: "Sitio web institucional", category: "Marketing", priority: "Media", status: "En progreso" },
];

export const seedMembers: Member[] = [
  { userId: "USR-001", role: "Desarrollador", name: "María García", email: "maria@example.com", position: "Frontend Developer", birthdate: "1996-03-14", phone: "+51 987 654 321", projectId: "P-001", isActive: true },
  { userId: "USR-002", role: "Desarrollador", name: "Juan Pérez", email: "juan@example.com", position: "Backend Developer", birthdate: "1994-07-22", phone: "+51 986 112 233", projectId: "P-004", isActive: true },
  { userId: "USR-003", role: "Diseñador", name: "Ana López", email: "ana@example.com", position: "UI/UX Designer", birthdate: "1998-11-02", phone: "+51 945 778 120", projectId: "P-002", isActive: false },
  { userId: "USR-004", role: "Desarrollador", name: "Carlos Ruiz", email: "carlos@example.com", position: "DevOps Engineer", birthdate: "1992-01-30", phone: "+51 933 450 876", projectId: "P-004", isActive: true },
  { userId: "USR-005", role: "Líder de proyecto", name: "Laura Martínez", email: "laura@example.com", position: "Project Manager", birthdate: "1990-09-18", phone: "+51 921 334 905", projectId: "P-001", isActive: true },
  { userId: "USR-006", role: "Analista", name: "Diego Salazar", email: "diego@example.com", position: "Data Analyst", birthdate: "1997-05-09", phone: "+51 955 201 764", projectId: "P-003", isActive: true },
  { userId: "USR-007", role: "Diseñador", name: "Valeria Quispe", email: "valeria@example.com", position: "Brand Designer", birthdate: "1999-12-25", phone: "+51 912 886 340", projectId: "P-006", isActive: true },
  { userId: "USR-008", role: "Administrador", name: "Renzo Huamán", email: "renzo@example.com", position: "Tech Lead", birthdate: "1989-04-03", phone: "+51 977 120 458", projectId: "P-005", isActive: true },
];

export const seedTasks: Task[] = [
  { id: "T-001", description: "Implementar autenticación", projectId: "P-001", status: "En progreso", priority: "Alta", userId: "USR-001", dateline: "2026-11-15" },
  { id: "T-002", description: "Diseñar pantalla de perfil", projectId: "P-002", status: "Pendiente", priority: "Media", userId: "USR-003", dateline: "2026-11-20" },
  { id: "T-003", description: "Configurar CI/CD", projectId: "P-004", status: "Completado", priority: "Alta", userId: "USR-004", dateline: "2026-11-10" },
  { id: "T-004", description: "Optimizar queries SQL", projectId: "P-001", status: "En progreso", priority: "Urgente", userId: "USR-002", dateline: "2026-11-12" },
  { id: "T-005", description: "Documentar API endpoints", projectId: "P-004", status: "Pendiente", priority: "Baja", userId: "USR-005", dateline: "2026-11-25" },
  { id: "T-006", description: "Definir tokens de color", projectId: "P-005", status: "Completado", priority: "Media", userId: "USR-007", dateline: "2026-10-28" },
  { id: "T-007", description: "Publicar librería en el registro", projectId: "P-005", status: "Completado", priority: "Baja", userId: "USR-008", dateline: "2026-11-03" },
  { id: "T-008", description: "Modelar tablero de métricas", projectId: "P-003", status: "Pendiente", priority: "Media", userId: "USR-006", dateline: "2026-12-01" },
  { id: "T-009", description: "Integrar pasarela de pagos", projectId: "P-001", status: "Pendiente", priority: "Urgente", userId: "USR-001", dateline: "2026-11-18" },
  { id: "T-010", description: "Pruebas en dispositivos físicos", projectId: "P-002", status: "En progreso", priority: "Alta", userId: "USR-003", dateline: "2026-11-14" },
  { id: "T-011", description: "Redactar textos de la portada", projectId: "P-006", status: "Completado", priority: "Baja", userId: "USR-007", dateline: "2026-11-05" },
  { id: "T-012", description: "Optimizar imágenes del sitio", projectId: "P-006", status: "En progreso", priority: "Media", userId: "USR-007", dateline: "2026-11-22" },
  { id: "T-013", description: "Limitar peticiones por usuario", projectId: "P-004", status: "En progreso", priority: "Alta", userId: "USR-002", dateline: "2026-11-27" },
  { id: "T-014", description: "Revisar accesibilidad de formularios", projectId: "P-002", status: "Pendiente", priority: "Media", userId: null, dateline: "2026-12-05" },
];

export const seedSettings: Settings = {
  displayName: "Rodrigo Ortiz",
  email: "rodrigo@example.com",
  language: "es",
  timezone: "America/Lima",
  defaultPriority: "Media",
  workdayStart: "09:00",
  workdayEnd: "18:00",
  emailNotifications: true,
  weeklyDigest: false,
  autoArchive: true,
  compactMode: false,
};
