"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field } from "@/components/forms/Field"
import { FormAlert, scrollDialogTop } from "@/components/forms/FormAlert"
import { SubmitButton } from "@/components/forms/SubmitButton"
import { useData } from "@/lib/data-context"
import { useNotice } from "@/lib/notice-context"
import { validateProject, type FieldErrors, type ProjectDraft } from "@/lib/rules"
import {
  PRIORITIES,
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  type Project,
} from "@/lib/types"

interface ProjectFormProps {
  /** Si se pasa, el formulario edita ese proyecto; si no, crea uno nuevo. */
  project?: Project
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProjectForm({ project, open, onOpenChange }: ProjectFormProps) {
  const [inner, setInner] = useState(false)
  const controlled = open !== undefined
  const isOpen = controlled ? open : inner
  const setOpen = (o: boolean) => (controlled ? onOpenChange?.(o) : setInner(o))

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {!controlled && (
        <DialogTrigger asChild>
          <Button>
            <PlusIcon data-icon="inline-start" />
            Nuevo Proyecto
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[560px]">
        <ProjectFormBody project={project} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

// El cuerpo se monta al abrir el diálogo, así el estado se reinicia en cada apertura.
function ProjectFormBody({ project, onDone }: { project?: Project; onDone: () => void }) {
  const { members, saveProject } = useData()
  const { notify } = useNotice()
  const editing = Boolean(project)

  const [draft, setDraft] = useState<ProjectDraft>({
    title: project?.title ?? "",
    description: project?.description ?? "",
    category: project?.category ?? ("" as ProjectDraft["category"]),
    priority: project?.priority ?? ("" as ProjectDraft["priority"]),
    status: project?.status ?? "Planificado",
  })
  const [memberIds, setMemberIds] = useState<string[]>(
    project ? members.filter((m) => m.projectId === project.id).map((m) => m.userId) : [],
  )
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof ProjectDraft>(key: K, value: ProjectDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const toggleMember = (id: string, checked: boolean) =>
    setMemberIds((ids) => (checked ? [...ids, id] : ids.filter((x) => x !== id)))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = e.currentTarget
    const found = validateProject(draft, memberIds)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      scrollDialogTop(form)
      return
    }

    setSaving(true)
    try {
      await saveProject({ ...draft, title: draft.title.trim(), description: draft.description.trim(), id: project?.id }, memberIds)
      notify({
        variant: "success",
        title: editing ? "Proyecto actualizado" : "Proyecto creado",
        description: `“${draft.title.trim()}” con ${memberIds.length} ${memberIds.length === 1 ? "miembro" : "miembros"}.`,
      })
      onDone()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{editing ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</DialogTitle>
        <DialogDescription>
          Completa la información del proyecto. Click en guardar cuando termines.
        </DialogDescription>
      </DialogHeader>

      <FormAlert errors={errors} />

      <div className="grid gap-4">
        <Field id="name" label="Nombre del Proyecto" required error={errors.title}>
          <Input
            id="name"
            placeholder="Mi Proyecto Increíble"
            value={draft.title}
            aria-invalid={Boolean(errors.title)}
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>

        <Field id="description" label="Descripción" error={errors.description} hint={`${draft.description.length}/140 caracteres`}>
          <Textarea
            id="description"
            rows={2}
            placeholder="Breve descripción del proyecto..."
            value={draft.description}
            aria-invalid={Boolean(errors.description)}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="category" label="Categoría" required error={errors.category}>
            <Select value={draft.category} onValueChange={(v) => set("category", v as ProjectDraft["category"])}>
              <SelectTrigger id="category" className="w-full" aria-invalid={Boolean(errors.category)}>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field id="priority" label="Prioridad" required error={errors.priority}>
            <Select value={draft.priority} onValueChange={(v) => set("priority", v as ProjectDraft["priority"])}>
              <SelectTrigger id="priority" className="w-full" aria-invalid={Boolean(errors.priority)}>
                <SelectValue placeholder="Selecciona la prioridad" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field id="status" label="Estado" required error={errors.status}>
          <Select value={draft.status} onValueChange={(v) => set("status", v as ProjectDraft["status"])}>
            <SelectTrigger id="status" className="w-full" aria-invalid={Boolean(errors.status)}>
              <SelectValue placeholder="Selecciona el estado" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          id="members"
          label="Miembros del equipo"
          required
          error={errors.members}
          hint={`${memberIds.length} seleccionados. Un miembro pertenece a un solo proyecto: al elegirlo aquí se mueve desde el anterior.`}
        >
          <div id="members" className="max-h-44 divide-y divide-border overflow-y-auto rounded-lg border border-input bg-background/60">
            {members.map((m) => {
              const other = m.projectId && m.projectId !== project?.id ? m.projectId : null
              return (
                <label key={m.userId} className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-accent/50">
                  <Checkbox
                    checked={memberIds.includes(m.userId)}
                    onCheckedChange={(c) => toggleMember(m.userId, c === true)}
                  />
                  <Avatar size="sm">
                    <AvatarFallback>{m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 text-sm">
                    <span className="font-semibold">{m.name}</span>
                    <span className="block text-xs text-muted-foreground">{m.position}</span>
                  </span>
                  {other && <span className="text-xs text-muted-foreground">hoy en {other}</span>}
                </label>
              )
            })}
          </div>
        </Field>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" disabled={saving} onClick={onDone}>
          Cancelar
        </Button>
        <SubmitButton loading={saving}>{editing ? "Guardar cambios" : "Crear Proyecto"}</SubmitButton>
      </DialogFooter>
    </form>
  )
}
