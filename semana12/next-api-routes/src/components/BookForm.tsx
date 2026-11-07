"use client";

import { useState } from "react";
import { api, json } from "@/lib/client";
import type { Author, Book } from "@/lib/types";
import Field from "./Field";
import Notice from "./Notice";

type Props = {
  authors: Pick<Author, "id" | "name">[];
  book?: Book;
  /** autor preseleccionado (p. ej. desde la ficha del autor) */
  authorId?: string;
  lockAuthor?: boolean;
  genres: string[];
  onSaved: (b: Book) => void;
  onCancel: () => void;
};

export default function BookForm({ authors, book, authorId, lockAuthor, genres, onSaved, onCancel }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const next: Record<string, string> = {};
    if (!get("title")) next.title = "El título es obligatorio";
    if (!get("authorId")) next.authorId = "Elige un autor";
    for (const k of ["publishedYear", "pages"]) {
      if (get(k) && !/^\d+$/.test(get(k))) next[k] = "Debe ser un número entero";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    const data = {
      title: get("title"),
      authorId: get("authorId"),
      genre: get("genre") || null,
      publishedYear: get("publishedYear") ? Number(get("publishedYear")) : null,
      pages: get("pages") ? Number(get("pages")) : null,
      isbn: get("isbn") || null,
      description: get("description") || null,
    };
    setSaving(true);
    setError("");
    try {
      const saved = await api<Book>(book ? `/api/books/${book.id}` : "/api/books", json(book ? "PUT" : "POST", data));
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
        <Field id="b-title" label="Título" error={errors.title} className="full">
          <input id="b-title" name="title" className="input" defaultValue={book?.title} autoComplete="off" />
        </Field>
        <Field id="b-author" label="Autor" error={errors.authorId} className="full">
          <select id="b-author" name="authorId" className="select" defaultValue={book?.authorId ?? authorId ?? ""} disabled={lockAuthor}>
            <option value="">Selecciona un autor…</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          {lockAuthor && <input type="hidden" name="authorId" value={authorId} />}
        </Field>
        <Field id="b-genre" label="Género">
          <input id="b-genre" name="genre" list="b-genres" className="input" defaultValue={book?.genre ?? ""} placeholder="Novela, Cuento…" />
          <datalist id="b-genres">{genres.map((g) => <option key={g} value={g} />)}</datalist>
        </Field>
        <Field id="b-year" label="Año de publicación" error={errors.publishedYear}>
          <input id="b-year" name="publishedYear" inputMode="numeric" className="input" defaultValue={book?.publishedYear ?? ""} />
        </Field>
        <Field id="b-pages" label="Páginas" error={errors.pages}>
          <input id="b-pages" name="pages" inputMode="numeric" className="input" defaultValue={book?.pages ?? ""} />
        </Field>
        <Field id="b-isbn" label="ISBN">
          <input id="b-isbn" name="isbn" className="input" defaultValue={book?.isbn ?? ""} autoComplete="off" />
        </Field>
        <Field id="b-desc" label="Descripción" className="full">
          <textarea id="b-desc" name="description" className="textarea" defaultValue={book?.description ?? ""} />
        </Field>
      </div>
      {error && <div style={{ marginTop: "var(--s-4)" }}><Notice kind="error">{error}</Notice></div>}
      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? <><span className="spinner" aria-hidden /> Guardando…</> : book ? "Guardar cambios" : "Crear libro"}
        </button>
      </div>
    </form>
  );
}
