"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/client";
import type { Author, AuthorStats, Book } from "@/lib/types";
import AuthorForm from "@/components/AuthorForm";
import AuthorImage from "@/components/AuthorImage";
import BookForm from "@/components/BookForm";
import ConfirmDelete from "@/components/ConfirmDelete";
import Dialog from "@/components/Dialog";
import Notice, { Loading } from "@/components/Notice";

// useParams() lee datos de la URL: con cacheComponents debe ir dentro de <Suspense>
export default function AuthorPage() {
  return (
    <Suspense fallback={<main className="page"><Loading label="Cargando ficha…" /></main>}>
      <AuthorView />
    </Suspense>
  );
}

function AuthorView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const [stats, setStats] = useState<AuthorStats | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [editAuthor, setEditAuthor] = useState(false);
  const [deleteAuthor, setDeleteAuthor] = useState(false);
  const [bookModal, setBookModal] = useState<Book | "new" | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  const load = useCallback(async () => {
    try {
      const [a, s, b] = await Promise.all([
        api<Author>(`/api/authors/${id}`),
        api<AuthorStats>(`/api/authors/${id}/stats`),
        api<Book[]>(`/api/authors/${id}/books`),
      ]);
      setAuthor(a);
      setStats(s);
      setBooks(b);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  if (error && !author) {
    return (
      <main className="page">
        <Link href="/" className="back"><ArrowLeft size={14} aria-hidden /> Autores</Link>
        <Notice kind="error">{error}</Notice>
      </main>
    );
  }
  if (!author) return <main className="page"><Loading label="Cargando ficha…" /></main>;

  return (
    <main className="page">
      <Link href="/" className="back"><ArrowLeft size={14} aria-hidden /> Autores</Link>

      {msg && <div style={{ marginBottom: "var(--s-4)" }}><Notice kind="ok" onClose={() => setMsg("")}>{msg}</Notice></div>}
      {error && <div style={{ marginBottom: "var(--s-4)" }}><Notice kind="error">{error}</Notice></div>}

      <section className="dossier">
        <figure className="dossier__portrait">
          <div className="plate__frame plate__frame--static">
            <AuthorImage name={author.name} src={author.imageUrl} sizes="(max-width: 48rem) 80vw, 18rem" priority />
          </div>
        </figure>

        <div className="dossier__main">
          <p className="eyebrow">Ficha de autor{author.nationality ? ` · ${author.nationality}` : ""}{author.birthYear ? ` · n. ${author.birthYear}` : ""}</p>
          <h1 className="dossier__name">{author.name}</h1>
          {author.bio && <p className="dossier__bio">{author.bio}</p>}
          <p className="muted" style={{ marginTop: "var(--s-3)", fontSize: "var(--fs-sm)" }}>{author.email}</p>
          <div className="shelf">
            <button className="btn btn--primary" onClick={() => setBookModal("new")}><Plus size={16} aria-hidden /> Agregar libro</button>
            <button className="btn" onClick={() => setEditAuthor(true)}><Pencil size={16} aria-hidden /> Editar autor</button>
            <button className="btn btn--danger" onClick={() => setDeleteAuthor(true)}><Trash2 size={16} aria-hidden /> Eliminar</button>
          </div>

          <aside className="dossier__side" aria-label="Estadísticas del autor">
            <h2>Estadísticas</h2>
            {stats ? (
              <dl className="facts facts--cols">
                <div className="facts__row"><dt>Libros publicados</dt><dd>{stats.totalBooks}</dd></div>
                <div className="facts__row"><dt>Páginas (prom.)</dt><dd>{stats.averagePages}</dd></div>
                <div className="facts__row"><dt>Primer libro</dt><dd>{stats.firstBook ? `${stats.firstBook.title} (${stats.firstBook.year})` : "—"}</dd></div>
                <div className="facts__row"><dt>Último libro</dt><dd>{stats.latestBook ? `${stats.latestBook.title} (${stats.latestBook.year})` : "—"}</dd></div>
                <div className="facts__row"><dt>Más extenso</dt><dd>{stats.longestBook ? `${stats.longestBook.title} (${stats.longestBook.pages})` : "—"}</dd></div>
                <div className="facts__row"><dt>Más breve</dt><dd>{stats.shortestBook ? `${stats.shortestBook.title} (${stats.shortestBook.pages})` : "—"}</dd></div>
                <div className="facts__row facts__row--wide"><dt>Géneros</dt><dd>{stats.genres.join(", ") || "—"}</dd></div>
              </dl>
            ) : <Loading />}
          </aside>
        </div>
      </section>

      <div className="strip" role="img" aria-label="Lomos de libros con motivos andinos" />

      <section>
        <div className="section-head">
          <h2>Obras</h2>
          <span className="muted">{books.length} {books.length === 1 ? "libro" : "libros"}</span>
        </div>
        {books.length === 0 ? (
          <div className="empty">
            <strong>Sin libros registrados</strong>
            Agrega el primer libro de {author.name}.
          </div>
        ) : (
          <ul className="ledger">
            {books.map((b) => (
              <li key={b.id} className="ledger__row book-row">
                <span className="ledger__n">{b.publishedYear ?? "s/f"}</span>
                <div>
                  <span className="ledger__title">{b.title}</span>
                  <div className="ledger__meta">
                    {b.pages && <span>{b.pages} págs.</span>}
                    {b.genre && <span className="chip">{b.genre}</span>}
                  </div>
                  {b.description && <p className="muted" style={{ fontSize: "var(--fs-sm)", marginTop: "var(--s-1)" }}>{b.description}</p>}
                </div>
                <div className="ledger__actions">
                  <button className="btn btn--sm" onClick={() => setBookModal(b)}><Pencil size={14} aria-hidden /> Editar</button>
                  <button className="btn btn--sm btn--danger" onClick={() => setDeletingBook(b)}><Trash2 size={14} aria-hidden /> Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog open={editAuthor} title="Editar autor" onClose={() => setEditAuthor(false)}>
        <AuthorForm
          author={author}
          onCancel={() => setEditAuthor(false)}
          onSaved={() => { setEditAuthor(false); setMsg("Autor actualizado."); load(); }}
        />
      </Dialog>

      <Dialog open={bookModal !== null} title={bookModal === "new" ? "Nuevo libro" : "Editar libro"} onClose={() => setBookModal(null)}>
        <BookForm
          authors={[{ id: author.id, name: author.name }]}
          authorId={author.id}
          lockAuthor
          genres={stats?.genres ?? []}
          book={bookModal && bookModal !== "new" ? bookModal : undefined}
          onCancel={() => setBookModal(null)}
          onSaved={(b) => { setBookModal(null); setMsg(`Libro «${b.title}» guardado.`); load(); }}
        />
      </Dialog>

      <ConfirmDelete
        open={deletingBook !== null}
        title="Eliminar libro"
        message={deletingBook ? `Se eliminará «${deletingBook.title}».` : ""}
        onClose={() => setDeletingBook(null)}
        onConfirm={async () => {
          await api(`/api/books/${deletingBook!.id}`, { method: "DELETE" });
          setMsg(`Libro «${deletingBook!.title}» eliminado.`);
          setDeletingBook(null);
          await load();
        }}
      />

      <ConfirmDelete
        open={deleteAuthor}
        title="Eliminar autor"
        message={`Se eliminará a «${author.name}» y sus ${books.length} libros. Esta acción no se puede deshacer.`}
        onClose={() => setDeleteAuthor(false)}
        onConfirm={async () => {
          await api(`/api/authors/${id}`, { method: "DELETE" });
          router.push("/");
        }}
      />
    </main>
  );
}
