import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/** Resumen de validación del formulario con el componente Alert. */
export function FormAlert({ errors }: { errors: Record<string, string> }) {
  const list = Object.values(errors);
  if (list.length === 0) return null;
  return (
    <Alert variant="destructive" className="aero-rise">
      <AlertCircleIcon />
      <AlertTitle>Revisa el formulario ({list.length} {list.length === 1 ? "problema" : "problemas"})</AlertTitle>
      <AlertDescription>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {list.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

/** Sube el diálogo al inicio para que el usuario vea el resumen de errores. */
export function scrollDialogTop(form: Element) {
  form.closest<HTMLElement>("[data-slot=dialog-content]")?.scrollTo({ top: 0, behavior: "smooth" });
}
