"use client";

import { useState } from "react";
import { api, json } from "@/lib/client";
import type { Author } from "@/lib/types";
import Field from "./Field";
import Notice from "./Notice";

type Props = { author?: Author; onSaved: (a: Author) => void; onCancel: () => void };

export default function AuthorForm({ author, onSaved, onCancel }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const birth = String(f.get("birthYear") ?? "").trim();
    const next: Record<string, string> = {};
    if (!name) next.name = "El nombre es obligatorio";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Ingresa un correo válido";
    if (birth && (!/^\d{3,4}$/.test(birth) || +birth > new Date().getFullYear())) next.birthYear = "Año no válido";
    setErrors(next);
    if (Object.keys(next).length) return;

    const data = {
      name,
      email,
      nationality: String(f.get("nationality") ?? "").trim() || null,
      birthYear: birth ? Number(birth) : null,
      bio: String(f.get("bio") ?? "").trim() || null,
      imageUrl: String(f.get("imageUrl") ?? "").trim() || null,
    };
    setSaving(true);
    setError("");
    try {
      const saved = await api<Author>(
        author ? `/api/authors/${author.id}` : "/api/authors",
        json(author ? "PUT" : "POST", data),
      );
      onSaved(saved);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      onChange={(e) => {
        // limpia el error del campo en cuanto el usuario lo edita
        const name = (e.nativeEvent.target as HTMLInputElement).name;
        if (errors[name]) setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== name)));
      }}
    >
      <div className="form-grid">
        <Field id="a-name" label="Nombre" error={errors.name} className="full">
          <input id="a-name" name="name" className="input" defaultValue={author?.name} autoComplete="off" aria-describedby={errors.name ? "a-name-error" : undefined} />
        </Field>
        <Field id="a-email" label="Correo" error={errors.email} className="full">
          <input id="a-email" name="email" type="email" className="input" defaultValue={author?.email} autoComplete="off" />
        </Field>
        <Field id="a-nat" label="Nacionalidad">
          <input id="a-nat" name="nationality" className="input" defaultValue={author?.nationality ?? "Perú"} />
        </Field>
        <Field id="a-birth" label="Año de nacimiento" error={errors.birthYear}>
          <input id="a-birth" name="birthYear" inputMode="numeric" className="input" defaultValue={author?.birthYear ?? ""} />
        </Field>
        <Field id="a-img" label="Imagen (ruta o URL, opcional)" className="full">
          <input id="a-img" name="imageUrl" className="input" defaultValue={author?.imageUrl ?? ""} placeholder="/img/autor-generico.webp" autoComplete="off" />
        </Field>
        <Field id="a-bio" label="Biografía" className="full">
          <textarea id="a-bio" name="bio" className="textarea" defaultValue={author?.bio ?? ""} />
        </Field>
      </div>
      {error && <div style={{ marginTop: "var(--s-4)" }}><Notice kind="error">{error}</Notice></div>}
      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? <><span className="spinner" aria-hidden /> Guardando…</> : author ? "Guardar cambios" : "Crear autor"}
        </button>
      </div>
    </form>
  );
}
