"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, useState } from "react";
import { seedMembers, seedProjects, seedSettings, seedTasks } from "./seed";
import type { Member, Project, Settings, Task } from "./types";

// Todo vive en memoria: se reinicia al recargar la página (sin base de datos, como pide la guía).
interface State {
  projects: Project[];
  members: Member[];
  tasks: Task[];
  settings: Settings;
}

export type ProjectInput = Omit<Project, "id"> & { id?: string };
export type MemberInput = Omit<Member, "userId"> & { userId?: string };
export type TaskInput = Omit<Task, "id"> & { id?: string };

type Action =
  | { type: "project/save"; project: ProjectInput; memberIds: string[] }
  | { type: "project/delete"; id: string }
  | { type: "member/save"; member: MemberInput }
  | { type: "member/delete"; userId: string }
  | { type: "task/save"; task: TaskInput }
  | { type: "task/delete"; id: string }
  | { type: "settings/save"; settings: Settings };

function nextId(ids: string[], prefix: string) {
  const max = ids.reduce((m, id) => Math.max(m, Number(id.split("-")[1]) || 0), 0);
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "project/save": {
      const id = action.project.id ?? nextId(state.projects.map((p) => p.id), "P");
      const project: Project = { ...action.project, id };
      const exists = state.projects.some((p) => p.id === id);
      const projects = exists ? state.projects.map((p) => (p.id === id ? project : p)) : [...state.projects, project];
      // member.projectId es la única fuente de verdad de la pertenencia al proyecto.
      const members = state.members.map((m) => {
        if (action.memberIds.includes(m.userId)) return { ...m, projectId: id };
        if (m.projectId === id) return { ...m, projectId: null };
        return m;
      });
      return { ...state, projects, members };
    }
    case "project/delete":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.id),
        tasks: state.tasks.filter((t) => t.projectId !== action.id),
        members: state.members.map((m) => (m.projectId === action.id ? { ...m, projectId: null } : m)),
      };
    case "member/save": {
      const userId = action.member.userId ?? nextId(state.members.map((m) => m.userId), "USR");
      const member: Member = { ...action.member, userId };
      const exists = state.members.some((m) => m.userId === userId);
      return { ...state, members: exists ? state.members.map((m) => (m.userId === userId ? member : m)) : [...state.members, member] };
    }
    case "member/delete":
      return {
        ...state,
        members: state.members.filter((m) => m.userId !== action.userId),
        tasks: state.tasks.map((t) => (t.userId === action.userId ? { ...t, userId: null } : t)),
      };
    case "task/save": {
      const id = action.task.id ?? nextId(state.tasks.map((t) => t.id), "T");
      const task: Task = { ...action.task, id };
      const exists = state.tasks.some((t) => t.id === id);
      return { ...state, tasks: exists ? state.tasks.map((t) => (t.id === id ? task : t)) : [...state.tasks, task] };
    }
    case "task/delete":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };
    case "settings/save":
      return { ...state, settings: action.settings };
  }
}

const LATENCY_MS = 900;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface DataContextValue extends State {
  /** true mientras hay una "petición al backend" simulada en curso (se muestra con <Spinner />). */
  busy: boolean;
  saveProject: (project: ProjectInput, memberIds: string[]) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  saveMember: (member: MemberInput) => Promise<void>;
  deleteMember: (userId: string) => Promise<void>;
  saveTask: (task: TaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  saveSettings: (settings: Settings) => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    projects: seedProjects,
    members: seedMembers,
    tasks: seedTasks,
    settings: seedSettings,
  });
  const [pending, setPending] = useState(0);

  // Simula latencia de red y luego aplica el cambio.
  const run = useCallback(async (action: Action) => {
    setPending((n) => n + 1);
    try {
      await wait(LATENCY_MS);
      dispatch(action);
    } finally {
      setPending((n) => n - 1);
    }
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      ...state,
      busy: pending > 0,
      saveProject: (project, memberIds) => run({ type: "project/save", project, memberIds }),
      deleteProject: (id) => run({ type: "project/delete", id }),
      saveMember: (member) => run({ type: "member/save", member }),
      deleteMember: (userId) => run({ type: "member/delete", userId }),
      saveTask: (task) => run({ type: "task/save", task }),
      deleteTask: (id) => run({ type: "task/delete", id }),
      saveSettings: (settings) => run({ type: "settings/save", settings }),
    }),
    [state, pending, run],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData debe usarse dentro de <DataProvider>");
  return ctx;
}

// ---- Selectores derivados (todo se calcula desde los datos en memoria) ----
export function projectProgress(projectId: string, tasks: Task[]) {
  const own = tasks.filter((t) => t.projectId === projectId);
  if (own.length === 0) return 0;
  return Math.round((own.filter((t) => t.status === "Completado").length / own.length) * 100);
}
