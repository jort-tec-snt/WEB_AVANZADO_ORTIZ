"use client"

import { useMemo, useState } from "react"
import { PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ConfirmDialog } from "@/components/forms/ConfirmDialog"
import { PriorityBadge, StatusBadge } from "@/components/dashboard/badges"
import { TaskForm } from "@/components/TaskForm"
import { useData } from "@/lib/data-context"
import { useNotice } from "@/lib/notice-context"
import { formatDate, isoToday } from "@/lib/rules"
import { TASK_STATUSES, type Task } from "@/lib/types"

const PAGE_SIZE = 6
const ALL = "all"

type Dialog = { kind: "create" } | { kind: "edit" | "delete"; task: Task } | null

/** Números de página con puntos suspensivos: 1 … 4 5 6 … 12 */
function pageList(current: number, total: number): (number | "gap-l" | "gap-r")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const out: (number | "gap-l" | "gap-r")[] = [1]
  const from = Math.max(2, current - 1)
  const to = Math.min(total - 1, current + 1)
  if (from > 2) out.push("gap-l")
  for (let p = from; p <= to; p++) out.push(p)
  if (to < total - 1) out.push("gap-r")
  out.push(total)
  return out
}

export function TasksTable() {
  const { tasks, projects, members, saveTask, deleteTask } = useData()
  const { notify } = useNotice()
  const [dialog, setDialog] = useState<Dialog>(null)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState(ALL)
  const [project, setProject] = useState(ALL)
  const [page, setPage] = useState(1)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const close = () => setDialog(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tasks
      .filter((t) => (status === ALL || t.status === status) && (project === ALL || t.projectId === project))
      .filter((t) => !q || t.description.toLowerCase().includes(q))
      .sort((a, b) => a.dateline.localeCompare(b.dateline) || a.id.localeCompare(b.id))
  }, [tasks, query, status, project])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages) // se ajusta solo al borrar o filtrar
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const today = isoToday()

  const projectName = (id: string) => projects.find((p) => p.id === id)?.title ?? "—"
  const userName = (id: string | null) => members.find((m) => m.userId === id)?.name ?? "Sin asignar"

  async function toggleDone(t: Task, done: boolean) {
    setTogglingId(t.id)
    try {
      await saveTask({ ...t, status: done ? "Completado" : "Pendiente" })
      notify({ variant: "success", title: done ? "Tarea completada" : "Tarea reabierta", description: t.description })
    } finally {
      setTogglingId(null)
    }
  }

  const target = dialog && dialog.kind !== "create" ? dialog.task : undefined
  const resetPage = <T,>(set: (v: T) => void) => (v: T) => {
    set(v)
    setPage(1)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Gestión de Tareas</CardTitle>
              <CardDescription>Administra todas las tareas de tus proyectos</CardDescription>
            </div>
            <Button variant="leaf" onClick={() => setDialog({ kind: "create" })}>
              <PlusIcon data-icon="inline-start" /> Nueva tarea
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="relative min-w-52 flex-1 sm:max-w-xs">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input aria-label="Buscar tareas" placeholder="Buscar tarea" className="pl-8" value={query} onChange={(e) => resetPage(setQuery)(e.target.value)} />
            </div>
            <Select value={status} onValueChange={resetPage(setStatus)}>
              <SelectTrigger aria-label="Filtrar por estado" className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos los estados</SelectItem>
                {TASK_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={project} onValueChange={resetPage(setProject)}>
              <SelectTrigger aria-label="Filtrar por proyecto" className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todos los proyectos</SelectItem>
                {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-md border bg-background/50">
            <Table>
              <TableCaption className="sr-only">Lista de todas las tareas del proyecto</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"><span className="sr-only">Completada</span></TableHead>
                  <TableHead>Tarea</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Asignado a</TableHead>
                  <TableHead>Fecha límite</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                      {tasks.length === 0 ? "No hay tareas todavía." : "Ninguna tarea coincide con los filtros."}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((t) => {
                    const overdue = t.status !== "Completado" && t.dateline < today
                    return (
                      <TableRow key={t.id} className={togglingId === t.id ? "opacity-60" : undefined}>
                        <TableCell>
                          <Checkbox
                            checked={t.status === "Completado"}
                            disabled={togglingId !== null}
                            aria-label={`Marcar “${t.description}” como completada`}
                            onCheckedChange={(c) => toggleDone(t, c === true)}
                          />
                        </TableCell>
                        <TableCell className="min-w-56 font-medium whitespace-normal">
                          <span className={t.status === "Completado" ? "text-muted-foreground line-through" : undefined}>{t.description}</span>
                          <span className="ml-2 font-mono text-xs text-muted-foreground">{t.id}</span>
                        </TableCell>
                        <TableCell>{projectName(t.projectId)}</TableCell>
                        <TableCell><StatusBadge status={t.status} /></TableCell>
                        <TableCell><PriorityBadge priority={t.priority} /></TableCell>
                        <TableCell>{userName(t.userId)}</TableCell>
                        <TableCell className={overdue ? "whitespace-nowrap font-bold text-destructive" : "whitespace-nowrap"}>
                          {formatDate(t.dateline)}{overdue ? " · vencida" : ""}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-0.5">
                            <Button size="icon-sm" variant="ghost" aria-label={`Editar ${t.id}`} onClick={() => setDialog({ kind: "edit", task: t })}>
                              <PencilIcon />
                            </Button>
                            <Button size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive" aria-label={`Eliminar ${t.id}`} onClick={() => setDialog({ kind: "delete", task: t })}>
                              <Trash2Icon />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {filtered.length === 0
                ? "0 tareas"
                : `Mostrando ${(current - 1) * PAGE_SIZE + 1}–${Math.min(current * PAGE_SIZE, filtered.length)} de ${filtered.length} ${filtered.length === 1 ? "tarea" : "tareas"}`}
            </p>
            {totalPages > 1 && (
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" text="Anterior" aria-label="Ir a la página anterior" aria-disabled={current === 1} className={current === 1 ? "pointer-events-none opacity-50" : undefined} onClick={(e) => { e.preventDefault(); setPage(current - 1) }} />
                  </PaginationItem>
                  {pageList(current, totalPages).map((p) =>
                    typeof p === "string" ? (
                      <PaginationItem key={p}><PaginationEllipsis /></PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink href="#" isActive={p === current} aria-label={`Ir a la página ${p}`} onClick={(e) => { e.preventDefault(); setPage(p) }}>{p}</PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext href="#" text="Siguiente" aria-label="Ir a la página siguiente" aria-disabled={current === totalPages} className={current === totalPages ? "pointer-events-none opacity-50" : undefined} onClick={(e) => { e.preventDefault(); setPage(current + 1) }} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>

      <TaskForm open={dialog?.kind === "create"} onOpenChange={(o) => !o && close()} />
      {target && (
        <>
          <TaskForm task={target} open={dialog?.kind === "edit"} onOpenChange={(o) => !o && close()} />
          <ConfirmDialog
            open={dialog?.kind === "delete"}
            onOpenChange={(o) => !o && close()}
            title={`Eliminar la tarea ${target.id}`}
            description={<>“{target.description}” se eliminará de forma permanente. Esta acción no se puede deshacer.</>}
            onConfirm={async () => {
              await deleteTask(target.id)
              notify({ variant: "success", title: "Tarea eliminada", description: target.description })
            }}
          />
        </>
      )}
    </>
  )
}
