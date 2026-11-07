"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/rules";
import { projectProgress, useData } from "@/lib/data-context";
import type { Project } from "@/lib/types";
import { PriorityBadge, StatusBadge } from "./badges";

export function ProjectDetails({
  project,
  open,
  onOpenChange,
  onEdit,
}: {
  project: Project;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onEdit: () => void;
}) {
  const { members, tasks } = useData();
  const team = members.filter((m) => m.projectId === project.id);
  const own = tasks.filter((t) => t.projectId === project.id);
  const progress = projectProgress(project.id, tasks);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
            <Badge variant="outline">{project.category}</Badge>
          </div>
          <DialogTitle className="text-xl">{project.title}</DialogTitle>
          <DialogDescription>{project.description || "Sin descripción."}</DialogDescription>
        </DialogHeader>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso (tareas completadas)</span>
            <span className="font-mono font-bold">{progress}%</span>
          </div>
          <div className="aero-progress"><span style={{ width: `${progress}%` }} /></div>
        </div>

        <section>
          <h3 className="mb-2 text-sm font-bold">Equipo ({team.length})</h3>
          {team.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay miembros asignados.</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {team.map((m) => (
                <li key={m.userId} className="flex items-center gap-2.5 rounded-lg border bg-background/60 p-2">
                  <Avatar size="sm"><AvatarFallback>{m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block truncate font-semibold">{m.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{m.position}</span>
                  </span>
                  {!m.isActive && <Badge variant="outline">Inactivo</Badge>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 className="mb-2 text-sm font-bold">Tareas ({own.length})</h3>
          {own.length === 0 ? (
            <p className="text-sm text-muted-foreground">Este proyecto no tiene tareas.</p>
          ) : (
            <ul className="divide-y rounded-lg border bg-background/60">
              {own.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center gap-2 px-3 py-2 text-sm">
                  <span className="min-w-0 flex-1 font-medium">{t.description}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(t.dateline)}</span>
                  <StatusBadge status={t.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button onClick={onEdit}>Editar proyecto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
