import type { ReactNode } from "react";

type Props = { id: string; label: string; error?: string; className?: string; children: ReactNode };

export default function Field({ id, label, error, className = "", children }: Props) {
  return (
    <div className={`field${error ? " field--error" : ""} ${className}`}>
      <label className="field__label" htmlFor={id}>{label}</label>
      {children}
      {error && <span className="field__error" id={`${id}-error`}>{error}</span>}
    </div>
  );
}
