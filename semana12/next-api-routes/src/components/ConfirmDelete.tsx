"use client";

import { useState } from "react";
import Dialog from "./Dialog";
import Notice from "./Notice";

type Props = { open: boolean; title: string; message: string; onConfirm: () => Promise<void>; onClose: () => void };

// Confirmacion propia (no window.confirm): accesible y estilizada
export default function ConfirmDelete({ open, title, message, onConfirm, onClose }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function go() {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} title={title} onClose={onClose}>
      <p>{message}</p>
      {error && <div style={{ marginTop: "var(--s-4)" }}><Notice kind="error">{error}</Notice></div>}
      <div className="form-actions">
        <button className="btn" onClick={onClose} disabled={busy}>Cancelar</button>
        <button className="btn btn--danger" onClick={go} disabled={busy}>
          {busy ? <><span className="spinner" aria-hidden /> Eliminando…</> : "Sí, eliminar"}
        </button>
      </div>
    </Dialog>
  );
}
