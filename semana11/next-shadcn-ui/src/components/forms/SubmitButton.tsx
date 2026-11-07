import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/** Botón de envío que muestra el Spinner mientras dura la petición simulada. */
export function SubmitButton({
  loading,
  children,
  loadingText = "Guardando…",
  variant = "default",
}: {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  variant?: "default" | "leaf" | "destructive";
}) {
  return (
    <Button type="submit" variant={variant} disabled={loading} aria-busy={loading}>
      {loading ? (
        <>
          <Spinner /> {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
