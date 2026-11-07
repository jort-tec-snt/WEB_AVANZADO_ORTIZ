"use client";

import { useState } from "react";
import { PencilIcon, Trash2Icon, UsersIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tilt } from "@/components/aero/Tilt";
import { ConfirmDialog } from "@/components/forms/ConfirmDialog";
import { ProjectForm } from "@/components/ProjectForm";
import { projectProgress, useData } from "@/lib/data-context";
import { useNotice } from "@/lib/notice-context";
import type { Project } from "@/lib/types";
import { StatusBadge } from "./badges";
import { ProjectDetails } from "./ProjectDetails";

type Dialogs = { kind: "details" | "edit" | "delete"; project: Project } | null;

export function ProjectsTab() {
  const { projects, members, tasks, deleteProject } = useData();
  const { notify } = useNotice();
  const [dialog, setDialog] = useState<Dialogs>(null);
  const close = () => setDialog(null);

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="font-bold">Aún no hay proyectos</p>
          <p className="text-sm text-muted-foreground">Usa “Nuevo Proyecto” para crear el primero.</p>
        </CardContent>
      </Card>
    );
  }

  const target = dialog?.project;
  const targetTasks = target ? tasks.filter((t) => t.projectId === target.id).length : 0;
  const targetMembers = target ? members.filter((m) => m.projectId === target.id).length : 0;

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const team = members.filter((m) => m.projectId === project.id);
          const progress = projectProgress(project.id, tasks);
          return (
            <Tilt key={project.id} max={4}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>{project.description || "Sin descripción"}</CardDescription>
                    </div>
                    <StatusBadge status={project.status} className="shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="mt-auto space-y-4">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-mono font-bold">{progress}%</span>
                    </div>
                    <div className="aero-progress"><span style={{ width: `${progress}%` }} /></div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {team.length > 0 ? (
                        <div className="flex -space-x-2">
                          {team.slice(0, 4).map((m) => (
                            <Avatar key={m.userId} size="sm" className="ring-2 ring-white">
                              <AvatarFallback>{m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      ) : (
                        <UsersIcon className="size-4" />
                      )}
                      <span>{team.length} {team.length === 1 ? "miembro" : "miembros"}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Button size="sm" variant="ghost" onClick={() => setDialog({ kind: "details", project })}>
                        Ver detalles
                      </Button>
                      <Button size="icon-sm" variant="ghost" aria-label={`Editar ${project.title}`} onClick={() => setDialog({ kind: "edit", project })}>
                        <PencilIcon />
                      </Button>
                      <Button size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive" aria-label={`Eliminar ${project.title}`} onClick={() => setDialog({ kind: "delete", project })}>
                        <Trash2Icon />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Tilt>
          );
        })}
      </div>

      {target && (
        <>
          <ProjectDetails
            project={target}
            open={dialog?.kind === "details"}
            onOpenChange={(o) => !o && close()}
            onEdit={() => setDialog({ kind: "edit", project: target })}
          />
          <ProjectForm project={target} open={dialog?.kind === "edit"} onOpenChange={(o) => !o && close()} />
          <ConfirmDialog
            open={dialog?.kind === "delete"}
            onOpenChange={(o) => !o && close()}
            title={`Eliminar “${target.title}”`}
            description={
              <>
                Esta acción no se puede deshacer. Se eliminarán también sus <strong>{targetTasks}</strong>{" "}
                {targetTasks === 1 ? "tarea" : "tareas"} y {targetMembers}{" "}
                {targetMembers === 1 ? "miembro quedará" : "miembros quedarán"} sin proyecto.
              </>
            }
            onConfirm={async () => {
              await deleteProject(target.id);
              notify({ variant: "success", title: "Proyecto eliminado", description: `“${target.title}” se eliminó correctamente.` });
            }}
          />
        </>
      )}
    </>
  );
}
