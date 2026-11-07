"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/forms/DatePicker";
import { Field } from "@/components/forms/Field";
import { FormAlert, scrollDialogTop } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { useData } from "@/lib/data-context";
import { useNotice } from "@/lib/notice-context";
import { isoToday, parseISO, validateTask, type FieldErrors, type TaskDraft } from "@/lib/rules";
import { PRIORITIES, TASK_STATUSES, type Task } from "@/lib/types";

const NONE = "none"; // Radix Select no admite value="" en un item

export function TaskForm({ task, open, onOpenChange }: { task?: Task; open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[560px]">
        <TaskFormBody task={task} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function TaskFormBody({ task, onDone }: { task?: Task; onDone: () => void }) {
  const { projects, members, saveTask } = useData();
  const { notify } = useNotice();
  const editing = Boolean(task);

  const [draft, setDraft] = useState<TaskDraft>({
    description: task?.description ?? "",
    projectId: task?.projectId ?? "",
    status: task?.status ?? "Pendiente",
    priority: task?.priority ?? ("" as TaskDraft["priority"]),
    userId: task?.userId ?? null,
    dateline: task?.dateline ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget;
    const found = validateTask(draft, !editing);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      scrollDialogTop(form);
      return;
    }
    setSaving(true);
    try {
      await saveTask({ ...draft, description: draft.description.trim(), id: task?.id });
      notify({ variant: "success", title: editing ? "Tarea actualizada" : "Tarea creada", description: draft.description.trim() });
      onDone();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{editing ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
        <DialogDescription>{editing ? `Tarea ${task?.id}` : "El código de la tarea se genera automáticamente al guardar."}</DialogDescription>
      </DialogHeader>

      <FormAlert errors={errors} />

      <Field id="t-desc" label="Descripción" required error={errors.description} hint={`${draft.description.length}/120 caracteres`}>
        <Textarea id="t-desc" rows={2} value={draft.description} aria-invalid={Boolean(errors.description)} placeholder="¿Qué hay que hacer?" onChange={(e) => set("description", e.target.value)} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="t-project" label="Proyecto" required error={errors.projectId}>
          <Select value={draft.projectId} onValueChange={(v) => set("projectId", v)}>
            <SelectTrigger id="t-project" className="w-full" aria-invalid={Boolean(errors.projectId)}>
              <SelectValue placeholder="Selecciona un proyecto" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field id="t-user" label="Asignado a">
          <Select value={draft.userId ?? NONE} onValueChange={(v) => set("userId", v === NONE ? null : v)}>
            <SelectTrigger id="t-user" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Sin asignar</SelectItem>
              {members.map((m) => (
                <SelectItem key={m.userId} value={m.userId} disabled={!m.isActive && m.userId !== task?.userId}>
                  {m.name}{m.isActive ? "" : " (inactivo)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field id="t-status" label="Estado" required error={errors.status}>
          <Select value={draft.status} onValueChange={(v) => set("status", v as TaskDraft["status"])}>
            <SelectTrigger id="t-status" className="w-full" aria-invalid={Boolean(errors.status)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TASK_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field id="t-priority" label="Prioridad" required error={errors.priority}>
          <Select value={draft.priority} onValueChange={(v) => set("priority", v as TaskDraft["priority"])}>
            <SelectTrigger id="t-priority" className="w-full" aria-invalid={Boolean(errors.priority)}>
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

      <Field id="t-dateline" label="Fecha límite" required error={errors.dateline} hint={editing ? undefined : "No puede estar en el pasado."}>
        <DatePicker
          id="t-dateline"
          value={draft.dateline}
          invalid={Boolean(errors.dateline)}
          startYear={new Date().getFullYear() - 1}
          endYear={new Date().getFullYear() + 3}
          disabled={editing ? undefined : (d) => d < (parseISO(isoToday()) as Date)}
          onChange={(iso) => set("dateline", iso)}
        />
      </Field>

      <DialogFooter>
        <Button type="button" variant="outline" disabled={saving} onClick={onDone}>Cancelar</Button>
        <SubmitButton loading={saving}>{editing ? "Guardar cambios" : "Crear tarea"}</SubmitButton>
      </DialogFooter>
    </form>
  );
}
