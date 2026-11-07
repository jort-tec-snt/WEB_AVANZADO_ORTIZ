"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/forms/DatePicker";
import { Field } from "@/components/forms/Field";
import { FormAlert, scrollDialogTop } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { useData } from "@/lib/data-context";
import { useNotice } from "@/lib/notice-context";
import { validateMember, type FieldErrors, type MemberDraft } from "@/lib/rules";
import { MEMBER_ROLES, type Member } from "@/lib/types";

const NONE = "none"; // Radix Select no admite value="" en un item

export function MemberForm({
  member,
  open,
  onOpenChange,
}: {
  /** Si se pasa, edita ese miembro; si no, crea uno nuevo. */
  member?: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[620px]">
        <MemberFormBody member={member} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function MemberFormBody({ member, onDone }: { member?: Member; onDone: () => void }) {
  const { members, projects, saveMember } = useData();
  const { notify } = useNotice();
  const editing = Boolean(member);

  const [draft, setDraft] = useState<MemberDraft>({
    role: member?.role ?? ("" as MemberDraft["role"]),
    name: member?.name ?? "",
    email: member?.email ?? "",
    position: member?.position ?? "",
    birthdate: member?.birthdate ?? "",
    phone: member?.phone ?? "",
    projectId: member?.projectId ?? null,
    isActive: member?.isActive ?? true,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof MemberDraft>(key: K, value: MemberDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget;
    const found = validateMember(draft, members.filter((m) => m.userId !== member?.userId));
    setErrors(found);
    if (Object.keys(found).length > 0) {
      scrollDialogTop(form)
      return
    };

    setSaving(true);
    try {
      await saveMember({ ...draft, name: draft.name.trim(), email: draft.email.trim(), position: draft.position.trim(), phone: draft.phone.trim(), userId: member?.userId });
      notify({ variant: "success", title: editing ? "Miembro actualizado" : "Miembro agregado", description: `${draft.name.trim()} · ${draft.role}` });
      onDone();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{editing ? "Editar miembro" : "Nuevo miembro"}</DialogTitle>
        <DialogDescription>
          {editing ? `ID de usuario ${member?.userId}` : "El ID de usuario (userId) se genera automáticamente al guardar."}
        </DialogDescription>
      </DialogHeader>

      <FormAlert errors={errors} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="m-name" label="Nombre completo" required error={errors.name}>
          <Input id="m-name" value={draft.name} aria-invalid={Boolean(errors.name)} placeholder="Nombre y apellido" onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field id="m-email" label="Correo" required error={errors.email}>
          <Input id="m-email" type="email" value={draft.email} aria-invalid={Boolean(errors.email)} placeholder="nombre@dominio.com" onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field id="m-role" label="Rol" required error={errors.role}>
          <Select value={draft.role} onValueChange={(v) => set("role", v as MemberDraft["role"])}>
            <SelectTrigger id="m-role" className="w-full" aria-invalid={Boolean(errors.role)}>
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              {MEMBER_ROLES.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field id="m-position" label="Cargo" required error={errors.position}>
          <Input id="m-position" value={draft.position} aria-invalid={Boolean(errors.position)} placeholder="Ej. Frontend Developer" onChange={(e) => set("position", e.target.value)} />
        </Field>
        <Field id="m-birthdate" label="Fecha de nacimiento" required error={errors.birthdate}>
          <DatePicker id="m-birthdate" value={draft.birthdate} invalid={Boolean(errors.birthdate)} endYear={new Date().getFullYear()} disabled={(d) => d > new Date()} onChange={(iso) => set("birthdate", iso)} />
        </Field>
        <Field id="m-phone" label="Teléfono" required error={errors.phone}>
          <Input id="m-phone" type="tel" value={draft.phone} aria-invalid={Boolean(errors.phone)} placeholder="+51 987 654 321" onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field id="m-project" label="Proyecto asignado" hint="Un miembro pertenece a un solo proyecto.">
          <Select value={draft.projectId ?? NONE} onValueChange={(v) => set("projectId", v === NONE ? null : v)}>
            <SelectTrigger id="m-project" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Sin proyecto</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <div className="flex items-center justify-between gap-3 rounded-lg border border-input bg-background/60 px-3 py-2 sm:self-end">
          <div>
            <p className="text-sm font-semibold">Miembro activo</p>
            <p className="text-xs text-muted-foreground">{draft.isActive ? "Puede recibir tareas" : "Inactivo: no cuenta en las métricas"}</p>
          </div>
          <Switch checked={draft.isActive} onCheckedChange={(c) => set("isActive", c)} aria-label="Miembro activo" />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" disabled={saving} onClick={onDone}>Cancelar</Button>
        <SubmitButton loading={saving}>{editing ? "Guardar cambios" : "Agregar miembro"}</SubmitButton>
      </DialogFooter>
    </form>
  );
}
