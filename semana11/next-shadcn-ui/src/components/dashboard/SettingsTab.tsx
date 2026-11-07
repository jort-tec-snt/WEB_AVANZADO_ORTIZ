"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/forms/Field";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { useData } from "@/lib/data-context";
import { useNotice } from "@/lib/notice-context";
import { validateSettings, type FieldErrors } from "@/lib/rules";
import { PRIORITIES, type Settings } from "@/lib/types";

const LANGUAGES: { value: Settings["language"]; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
];
const TIMEZONES = ["America/Lima", "America/Bogota", "America/Mexico_City", "America/Santiago", "America/Argentina/Buenos_Aires", "Europe/Madrid", "UTC"];

const TOGGLES: { key: keyof Pick<Settings, "emailNotifications" | "weeklyDigest" | "autoArchive" | "compactMode">; title: string; hint: string }[] = [
  { key: "emailNotifications", title: "Notificaciones por correo", hint: "Avisos cuando te asignan una tarea o cambia un proyecto." },
  { key: "weeklyDigest", title: "Resumen semanal", hint: "Un correo cada lunes con el avance de tus proyectos." },
  { key: "autoArchive", title: "Archivar proyectos completados", hint: "Los proyectos completados se archivan a los 30 días." },
  { key: "compactMode", title: "Modo compacto", hint: "Reduce el espaciado de tablas y listas." },
];

export function SettingsTab() {
  const { settings, saveSettings } = useData();
  const { notify } = useNotice();
  const [draft, setDraft] = useState<Settings>(settings);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setDraft((d) => ({ ...d, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateSettings(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSaving(true);
    try {
      const clean = { ...draft, displayName: draft.displayName.trim(), email: draft.email.trim() };
      await saveSettings(clean);
      setDraft(clean);
      setSavedAt(new Date());
      notify({ variant: "success", title: "Configuración guardada", description: "Tus preferencias se actualizaron (simulado en memoria)." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>Administra las preferencias de tu cuenta. Los cambios se simulan en memoria.</CardDescription>
        </CardHeader>
        <CardContent className="mt-4 space-y-6">
          <FormAlert errors={errors} />

          <section className="grid gap-4 sm:grid-cols-2">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground sm:col-span-2">Perfil</h3>
            <Field id="s-name" label="Nombre visible" required error={errors.displayName}>
              <Input id="s-name" value={draft.displayName} aria-invalid={Boolean(errors.displayName)} onChange={(e) => set("displayName", e.target.value)} />
            </Field>
            <Field id="s-email" label="Correo de contacto" required error={errors.email}>
              <Input id="s-email" type="email" value={draft.email} aria-invalid={Boolean(errors.email)} onChange={(e) => set("email", e.target.value)} />
            </Field>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground sm:col-span-3">Preferencias</h3>
            <Field id="s-lang" label="Idioma">
              <Select value={draft.language} onValueChange={(v) => set("language", v as Settings["language"])}>
                <SelectTrigger id="s-lang" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{LANGUAGES.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field id="s-tz" label="Zona horaria">
              <Select value={draft.timezone} onValueChange={(v) => set("timezone", v)}>
                <SelectTrigger id="s-tz" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{TIMEZONES.map((z) => <SelectItem key={z} value={z}>{z.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field id="s-prio" label="Prioridad por defecto" hint="Para las tareas nuevas.">
              <Select value={draft.defaultPriority} onValueChange={(v) => set("defaultPriority", v as Settings["defaultPriority"])}>
                <SelectTrigger id="s-prio" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground sm:col-span-2">Jornada laboral</h3>
            <Field id="s-start" label="Inicio" error={errors.workday}>
              <Input id="s-start" type="time" value={draft.workdayStart} aria-invalid={Boolean(errors.workday)} onChange={(e) => set("workdayStart", e.target.value)} />
            </Field>
            <Field id="s-end" label="Fin">
              <Input id="s-end" type="time" value={draft.workdayEnd} aria-invalid={Boolean(errors.workday)} onChange={(e) => set("workdayEnd", e.target.value)} />
            </Field>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Notificaciones e interfaz</h3>
            {TOGGLES.map((t) => (
              <div key={t.key} className="flex items-center justify-between gap-4 rounded-lg border border-input bg-background/60 px-3 py-2.5">
                <div>
                  <p id={`${t.key}-label`} className="text-sm font-semibold">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.hint}</p>
                </div>
                <Switch checked={draft[t.key]} onCheckedChange={(c) => set(t.key, c)} aria-labelledby={`${t.key}-label`} />
              </div>
            ))}
          </section>
        </CardContent>
        <CardFooter className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {dirty ? "Tienes cambios sin guardar." : savedAt ? `Guardado a las ${savedAt.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}` : "Sin cambios."}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" disabled={!dirty || saving} onClick={() => { setDraft(settings); setErrors({}); }}>
              Restablecer
            </Button>
            <SubmitButton loading={saving} >Guardar cambios</SubmitButton>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
