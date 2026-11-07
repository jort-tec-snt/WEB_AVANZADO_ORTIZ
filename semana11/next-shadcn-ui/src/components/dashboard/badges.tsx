import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Priority, ProjectStatus, TaskStatus } from "@/lib/types";

const STATUS: Record<ProjectStatus | TaskStatus, string> = {
  Planificado: "bg-muted text-muted-foreground border-border",
  Pendiente: "bg-muted text-muted-foreground border-border",
  "En progreso": "bg-[oklch(0.92_0.06_225)] text-[oklch(0.38_0.12_235)] border-[oklch(0.8_0.08_225)]",
  "En revisión": "bg-[oklch(0.94_0.08_85)] text-[oklch(0.4_0.09_70)] border-[oklch(0.85_0.1_85)]",
  Completado: "bg-accent text-accent-foreground border-[oklch(0.8_0.1_150)]",
};

const PRIORITY: Record<Priority, string> = {
  Baja: "bg-muted text-muted-foreground border-border",
  Media: "bg-[oklch(0.92_0.06_225)] text-[oklch(0.38_0.12_235)] border-[oklch(0.8_0.08_225)]",
  Alta: "bg-[oklch(0.94_0.08_85)] text-[oklch(0.4_0.09_70)] border-[oklch(0.85_0.1_85)]",
  Urgente: "bg-destructive/10 text-destructive border-destructive/30",
};

export function StatusBadge({ status, className }: { status: ProjectStatus | TaskStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-bold", STATUS[status], className)}>
      {status}
    </Badge>
  );
}

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-bold", PRIORITY[priority], className)}>
      {priority}
    </Badge>
  );
}
