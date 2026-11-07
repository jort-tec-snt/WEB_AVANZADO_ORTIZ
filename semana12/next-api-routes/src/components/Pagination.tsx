import type { Pagination as P } from "@/lib/types";

type Props = { pagination: P; onPage: (page: number) => void; disabled?: boolean };

// Ventana de paginas alrededor de la actual, con primera y ultima
function pagesToShow(page: number, total: number) {
  const set = new Set([1, total, page - 1, page, page + 1]);
  return [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
}

export default function Pagination({ pagination, onPage, disabled }: Props) {
  const { page, totalPages, hasNext, hasPrev, total, limit } = pagination;
  if (totalPages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const nums = pagesToShow(page, totalPages);

  return (
    <nav className="pager" aria-label="Paginación">
      <span className="muted">{from}–{to} de {total}</span>
      <div className="pager__nums">
        <button className="btn btn--sm" disabled={!hasPrev || disabled} onClick={() => onPage(page - 1)}>← Anterior</button>
        {nums.map((n, i) => (
          <span key={n} style={{ display: "contents" }}>
            {i > 0 && n - nums[i - 1] > 1 && <span className="pager__num muted">…</span>}
            <button
              className="pager__num"
              aria-current={n === page ? "page" : undefined}
              aria-label={`Página ${n}`}
              disabled={disabled}
              onClick={() => onPage(n)}
            >
              {n}
            </button>
          </span>
        ))}
        <button className="btn btn--sm" disabled={!hasNext || disabled} onClick={() => onPage(page + 1)}>Siguiente →</button>
      </div>
    </nav>
  );
}
