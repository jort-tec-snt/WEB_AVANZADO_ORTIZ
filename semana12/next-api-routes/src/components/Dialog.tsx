"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = { open: boolean; title: string; onClose: () => void; children: ReactNode };

// <dialog> nativo: foco atrapado, Escape y backdrop sin dependencias
export default function Dialog({ open, title, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dialog-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {open && (
        <>
          <div className="dialog__head">
            <h2 id="dialog-title">{title}</h2>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar" title="Cerrar"><X size={18} aria-hidden /></button>
          </div>
          <div className="dialog__body">{children}</div>
        </>
      )}
    </dialog>
  );
}
