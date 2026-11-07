"use client";

import { useMemo, useState } from "react";
import { PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/forms/ConfirmDialog";
import { MemberForm } from "@/components/MemberForm";
import { useData } from "@/lib/data-context";
import { useNotice } from "@/lib/notice-context";
import { formatDate } from "@/lib/rules";
import type { Member } from "@/lib/types";

type Dialog = { kind: "create" } | { kind: "edit" | "delete"; member: Member } | null;

export function TeamTab() {
  const { members, projects, tasks, deleteMember } = useData();
  const { notify } = useNotice();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [query, setQuery] = useState("");
  const close = () => setDialog(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => [m.name, m.email, m.position, m.userId, m.role].some((v) => v.toLowerCase().includes(q)));
  }, [members, query]);

  const projectName = (id: string | null) => projects.find((p) => p.id === id)?.title ?? "Sin proyecto";
  const target = dialog && dialog.kind !== "create" ? dialog.member : undefined;
  const assigned = target ? tasks.filter((t) => t.userId === target.userId).length : 0;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Miembros del Equipo</CardTitle>
              <CardDescription>Gestiona los miembros de tu equipo y sus roles</CardDescription>
            </div>
            <Button variant="leaf" onClick={() => setDialog({ kind: "create" })}>
              <PlusIcon data-icon="inline-start" /> Nuevo miembro
            </Button>
          </div>
          <div className="relative mt-3 max-w-sm">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Buscar miembros" placeholder="Buscar por nombre, correo o cargo" className="pl-8" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border bg-background/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miembro</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Nacimiento</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                      {members.length === 0 ? "No hay miembros todavía." : `Sin resultados para “${query}”.`}
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((m) => (
                    <TableRow key={m.userId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar><AvatarFallback>{m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold">{m.name}</p>
                            <p className="text-xs text-muted-foreground">{m.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{m.userId}</TableCell>
                      <TableCell>{m.role}</TableCell>
                      <TableCell>{m.position}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(m.birthdate)}</TableCell>
                      <TableCell className="whitespace-nowrap">{m.phone}</TableCell>
                      <TableCell>{projectName(m.projectId)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={m.isActive ? "border-[oklch(0.8_0.1_150)] bg-accent font-bold text-accent-foreground" : "font-bold text-muted-foreground"}>
                          {m.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-0.5">
                          <Button size="icon-sm" variant="ghost" aria-label={`Editar a ${m.name}`} onClick={() => setDialog({ kind: "edit", member: m })}>
                            <PencilIcon />
                          </Button>
                          <Button size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive" aria-label={`Eliminar a ${m.name}`} onClick={() => setDialog({ kind: "delete", member: m })}>
                            <Trash2Icon />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {visible.length} de {members.length} {members.length === 1 ? "miembro" : "miembros"}
          </p>
        </CardContent>
      </Card>

      <MemberForm open={dialog?.kind === "create"} onOpenChange={(o) => !o && close()} />
      {target && (
        <>
          <MemberForm member={target} open={dialog?.kind === "edit"} onOpenChange={(o) => !o && close()} />
          <ConfirmDialog
            open={dialog?.kind === "delete"}
            onOpenChange={(o) => !o && close()}
            title={`Eliminar a ${target.name}`}
            description={
              <>
                Esta acción no se puede deshacer.{" "}
                {assigned > 0 ? <>Sus <strong>{assigned}</strong> {assigned === 1 ? "tarea quedará" : "tareas quedarán"} sin asignar.</> : "No tiene tareas asignadas."}
              </>
            }
            onConfirm={async () => {
              await deleteMember(target.userId);
              notify({ variant: "success", title: "Miembro eliminado", description: `${target.name} ya no forma parte del equipo.` });
            }}
          />
        </>
      )}
    </>
  );
}
