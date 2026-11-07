type Props = { kind?: "error" | "ok"; children: React.ReactNode; onClose?: () => void };

export default function Notice({ kind, children, onClose }: Props) {
  return (
    <div className={`notice${kind ? ` notice--${kind}` : ""}`} role={kind === "error" ? "alert" : "status"}>
      <span>{children}</span>
      {onClose && <button type="button" className="btn-link" onClick={onClose}>Cerrar</button>}
    </div>
  );
}

export function Loading({ label = "Cargando…" }: { label?: string }) {
  return (
    <div className="loading" role="status">
      <span className="spinner" aria-hidden /> {label}
    </div>
  );
}
