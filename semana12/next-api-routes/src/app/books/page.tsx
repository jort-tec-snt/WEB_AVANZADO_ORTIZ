"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { api } from "@/lib/client";
import { useDebounce } from "@/lib/useDebounce";
import type { Author, Book, GeneralStats, Pagination as P } from "@/lib/types";
import BookForm from "@/components/BookForm";
import ConfirmDelete from "@/components/ConfirmDelete";
import Dialog from "@/components/Dialog";
import Notice, { Loading } from "@/components/Notice";
import Pagination from "@/components/Pagination";

type Result = { data: Book[]; pagination: P };
const SORTS = [
  { v: "createdAt", l: "Registro" },
  { v: "title", l: "Título" },
  { v: "publishedYear", l: "Año" },
];

export default function BooksPage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 300);

  const [res, setRes] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [editing, setEditing] = useState<Book | "new" | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);

  const loadFilters = useCallback(async () => {
    try {
      const [a, s] = await Promise.all([api<Author[]>("/api/authors"), api<GeneralStats>("/api/stats")]);
      setAuthors(a);
      setGenres(s.genres.map((g) => g.genre));
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const query = useCallback(async () => {
    const qs = new URLSearchParams({ page: String(page), limit: "6", sortBy, order });
    if (debounced.trim()) qs.set("search", debounced.trim());
    if (genre) qs.set("genre", genre);
    if (authorId) qs.set("authorId", authorId);
    setLoading(true);
    try {
      setRes(await api<Result>(`/api/books/search?${qs}`));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [debounced, genre, authorId, sortBy, order, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFilters();
  }, [loadFilters]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    query();
  }, [query]);

  // cualquier cambio de filtro vuelve a la pagina 1
  const reset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  const refresh = () => {
    loadFilters();
    query();
  };

  return (
    <main className="page">
      <header className="band">
        <div className="band__copy">
          <p className="eyebrow">Catálogo</p>
          <h1>Libros</h1>
          <button className="btn btn--primary" onClick={() => setEditing("new")} disabled={authors.length === 0}>
            <Plus size={16} aria-hidden /> Nuevo libro
          </button>
        </div>
        <div className="band__art" aria-hidden />
      </header>

      {msg && <div style={{ marginBottom: "var(--s-4)" }}><Notice kind="ok" onClose={() => setMsg("")}>{msg}</Notice></div>}
      {error && <div style={{ marginBottom: "var(--s-4)" }}><Notice kind="error">{error}</Notice></div>}

      <form className="toolbar" role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="field full">
          <label className="field__label" htmlFor="q">Buscar por título</label>
          <div className="input-icon">
          <Search size={16} aria-hidden />
          <input id="q" type="search" className="input" placeholder="La casa, ciudad, Chivo…" value={search} onChange={(e) => reset(setSearch)(e.target.value)} autoComplete="off" />
          </div>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="f-genre">Género</label>
          <select id="f-genre" className="select" value={genre} onChange={(e) => reset(setGenre)(e.target.value)}>
            <option value="">Todos</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="f-author">Autor</label>
          <select id="f-author" className="select" value={authorId} onChange={(e) => reset(setAuthorId)(e.target.value)}>
            <option value="">Todos</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="f-sort">Ordenar por</label>
          <div style={{ display: "flex", gap: "var(--s-2)" }}>
            <select id="f-sort" className="select" value={sortBy} onChange={(e) => reset(setSortBy)(e.target.value)}>
              {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
            <button type="button" className="btn" style={{ minWidth: "3rem" }} onClick={() => reset(setOrder)(order === "asc" ? "desc" : "asc")} aria-label={order === "asc" ? "Orden ascendente" : "Orden descendente"} title={order === "asc" ? "Ascendente" : "Descendente"}>
              {order === "asc" ? <ArrowUp size={16} aria-hidden /> : <ArrowDown size={16} aria-hidden />}
            </button>
          </div>
        </div>
      </form>

      <div className="toolbar__count" aria-live="polite">
        <span>
          {loading && <span className="spinner" aria-hidden />} {" "}
          <strong>{res?.pagination.total ?? "…"}</strong> {res?.pagination.total === 1 ? "resultado" : "resultados"}
        </span>
        {(search || genre || authorId) && (
          <button className="btn-link" onClick={() => { setSearch(""); setGenre(""); setAuthorId(""); setPage(1); }}>
            <X size={14} aria-hidden /> Limpiar filtros
          </button>
        )}
      </div>

      {!res && loading && <Loading label="Buscando libros…" />}
      {res && (
        <div className="results" aria-busy={loading}>
          {res.data.length === 0 ? (
            <div className="empty">
              <strong>Sin resultados</strong>
              Ningún libro coincide con estos filtros.
            </div>
          ) : (
            <ul className="ledger">
              {res.data.map((b) => (
                <li key={b.id} className="ledger__row book-row">
                  <span className="ledger__n">{b.publishedYear ?? "s/f"}</span>
                  <div>
                    <span className="ledger__title">{b.title}</span>
                    <div className="ledger__meta">
                      {b.author && <Link href={`/authors/${b.author.id}`}>{b.author.name}</Link>}
                      {b.pages && <span>{b.pages} págs.</span>}
                      {b.genre && <span className="chip">{b.genre}</span>}
                    </div>
                  </div>
                  <div className="ledger__actions">
                    <button className="btn btn--sm" onClick={() => setEditing(b)}><Pencil size={14} aria-hidden /> Editar</button>
                    <button className="btn btn--sm btn--danger" onClick={() => setDeleting(b)}><Trash2 size={14} aria-hidden /> Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Pagination pagination={res.pagination} onPage={setPage} disabled={loading} />
        </div>
      )}

      <Dialog open={editing !== null} title={editing === "new" ? "Nuevo libro" : "Editar libro"} onClose={() => setEditing(null)}>
        <BookForm
          authors={authors}
          genres={genres}
          book={editing && editing !== "new" ? editing : undefined}
          onCancel={() => setEditing(null)}
          onSaved={(b) => {
            setEditing(null);
            setMsg(`Libro «${b.title}» guardado.`);
            refresh();
          }}
        />
      </Dialog>

      <ConfirmDelete
        open={deleting !== null}
        title="Eliminar libro"
        message={deleting ? `Se eliminará «${deleting.title}». Esta acción no se puede deshacer.` : ""}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          await api(`/api/books/${deleting!.id}`, { method: "DELETE" });
          setMsg(`Libro «${deleting!.title}» eliminado.`);
          setDeleting(null);
          if (res && res.data.length === 1 && page > 1) setPage(page - 1);
          refresh();
        }}
      />
    </main>
  );
}
