import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string };

export default function Field({ label, id, ...props }: Props) {
  const inputId = id ?? props.name;
  return (
    <div className="field">
      <label htmlFor={inputId} className="field__label">
        {label}
      </label>
      <input id={inputId} className="field__input" {...props} />
    </div>
  );
}
