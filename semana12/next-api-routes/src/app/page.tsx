"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/client";
import type { Author, GeneralStats } from "@/lib/types";
import AuthorForm from "@/components/AuthorForm";
import AuthorImage from "@/components/AuthorImage";
import ConfirmDelete from "@/components/ConfirmDelete";
import Dialog from "@/components/Dialog";
import Notice, { Loading } from "@/components/Notice";

export default function Dashboard() {
  const [authors, setAuthors] = useState<Author[] | null>(null);
  const [stats, setStats] = useState<GeneralStats | null>(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState<Author | "new" | null>(null);
  const [deleting, setDeleting] = useState<Author | null>(null);

  const load = useCallback(async () => {
    try {
      const [a, s] = await Promise.all([api<Author[]>("/api/authors"), api<GeneralStats>("/api/stats")]);
      setAuthors(a);
      setStats(s);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const figures: [string, string | number][] = stats
    ? [
        ["Autores", stats.totalAuthors],
        ["Libros", stats.totalBooks],
        ["Géneros", stats.genres.length],
        ["Págs. por libro", stats.averagePages],
        ["Periodo", stats.firstYear ? `${stats.firstYear}–${stats.lastYear}` : "—"],
        ["Más obras", stats.topAuthor ? `${stats.topAuthor.name.split(" ").slice(-1)[0]} (${stats.topAuthor.books})` : "—"],
      ]
    : [];

  return (
    <main className="page">
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Catálogo · Literatura peruana</p>
          <h1>
            Autores <em>y obras</em>
          </h1>
          <p className="hero__lead">Registra autores, asocia sus libros y consulta las cifras del fondo bibliográfico.</p>
          <div className="shelf">
            <button className="btn btn--primary" onClick={() => setEditing("new")}>
              <Plus size={16} aria-hidden /> Nuevo autor
            </button>
            <Link href="/books" className="btn">
              <BookOpen size={16} aria-hidden /> Explorar libros
            </Link>
          </div>
        </div>
        <div className="hero__art" role="img" aria-label="Grabado de una biblioteca con estantes y una escalera" />
      </section>

      <section aria-label="Estadísticas generales" className="figures">
        {!stats ? (
          <Loading label="Calculando…" />
        ) : (
          figures.map(([label, value]) => (
            <div key={label} className="figures__item">
              <span className="figures__value">{value}</span>
              <span className="figures__label">{label}</span>
            </div>
          ))
        )}
      </section>

      {msg && <div style={{ marginBottom: "var(--s-4)" }}><Notice kind="ok" onClose={() => setMsg("")}>{msg}</Notice></div>}
      {error && <div style={{ marginBottom: "var(--s-4)" }}><Notice kind="error">{error}</Notice></div>}

      <section>
        <div className="section-head">
          <h2>Galería de autores</h2>
          {authors && <span className="muted">{authors.length} registrados</span>}
        </div>

        {!authors && !error && <Loading label="Cargando autores…" />}
        {authors && authors.length === 0 && (
          <div className="empty">
            <strong>Aún no hay autores</strong>
            Crea el primero para empezar a catalogar sus libros.
          </div>
        )}
        {authors && authors.length > 0 && (
          <ul className="plates">
            {authors.map((a, i) => (
              <li key={a.id} className="plate">
                <Link href={`/authors/${a.id}`} className="plate__frame" aria-label={`Abrir la ficha de ${a.name}`}>
                  <AuthorImage name={a.name} src={a.imageUrl} sizes="(max-width: 48rem) 90vw, 20rem" priority={i < 3} />
                  <span className="plate__tag">N.º {String(i + 1).padStart(2, "0")}</span>
                </Link>
                <div>
                  <Link href={`/authors/${a.id}`} className="plate__name">{a.name}</Link>
                  <div className="ledger__meta">
                    {a.nationality && <span>{a.nationality}</span>}
                    {a.birthYear && <span>n. {a.birthYear}</span>}
                    <span className="chip chip--accent">{a._count?.books ?? 0} libros</span>
                  </div>
                </div>
                <div className="plate__actions">
                  <Link href={`/authors/${a.id}`} className="btn btn--sm"><BookOpen size={14} aria-hidden /> Ver libros</Link>
                  <button className="btn btn--sm btn--icon" onClick={() => setEditing(a)} aria-label={`Editar a ${a.name}`} title="Editar"><Pencil size={14} aria-hidden /></button>
                  <button className="btn btn--sm btn--icon btn--danger" onClick={() => setDeleting(a)} aria-label={`Eliminar a ${a.name}`} title="Eliminar"><Trash2 size={14} aria-hidden /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog open={editing !== null} title={editing === "new" ? "Nuevo autor" : "Editar autor"} onClose={() => setEditing(null)}>
        <AuthorForm
          author={editing && editing !== "new" ? editing : undefined}
          onCancel={() => setEditing(null)}
          onSaved={(a) => {
            setEditing(null);
            setMsg(`Autor «${a.name}» guardado.`);
            load();
          }}
        />
      </Dialog>

      <ConfirmDelete
        open={deleting !== null}
        title="Eliminar autor"
        message={
          deleting
            ? `Se eliminará a «${deleting.name}» y sus ${deleting._count?.books ?? 0} libros. Esta acción no se puede deshacer.`
            : ""
        }
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          await api(`/api/authors/${deleting!.id}`, { method: "DELETE" });
          setMsg(`Autor «${deleting!.name}» eliminado.`);
          setDeleting(null);
          await load();
        }}
      />
    </main>
  );
}
