"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProjectForm } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TasksTable"
import { ProjectsTab } from "@/components/dashboard/ProjectsTab"
import { TeamTab } from "@/components/dashboard/TeamTab"
import { SettingsTab } from "@/components/dashboard/SettingsTab"
import { Hero } from "@/components/aero/Hero"
import { StatCard } from "@/components/dashboard/StatCard"
import { projectProgress, useData } from "@/lib/data-context"
import { formatDate } from "@/lib/rules"

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

export default function DashboardPage() {
  const { projects, tasks, members } = useData()
  const done = tasks.filter((t) => t.status === "Completado").length
  const open = tasks.length - done
  const urgent = tasks.filter((t) => t.priority === "Urgente" && t.status !== "Completado").length
  const active = members.filter((m) => m.isActive).length
  const recent = [...tasks].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 4)
  return (
    <div className="min-h-screen px-4 py-6 sm:px-8 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Hero
          eyebrow="Panel de proyectos"
          title="Aero Projects"
          subtitle="Gestiona proyectos, equipo y tareas con shadcn/ui, en un entorno claro y fresco."
        >
          <ProjectForm />
        </Hero>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="aero-glass h-auto gap-1 rounded-2xl p-1.5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Tab: Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-x-4 gap-y-8 pt-3 md:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Proyectos" value={projects.length} hint={plural(projects.filter((p) => p.status === "Completado").length, "completado", "completados")} orb="aqua" />
              <StatCard label="Tareas Completadas" value={done} hint={`de ${tasks.length} tareas en total`} orb="leaf" delay={0.6} />
              <StatCard label="Tareas Abiertas" value={open} hint={plural(urgent, "urgente sin completar", "urgentes sin completar")} orb="sky" delay={1.2} />
              <StatCard label="Miembros Activos" value={active} hint={plural(members.length - active, "inactivo", "inactivos")} orb="lime" delay={1.8} />
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
            {/* Recent Activity */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas tareas registradas en tus proyectos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recent.map((t) => {
                    const who = members.find((m) => m.userId === t.userId)?.name ?? "Sin asignar"
                    return (
                      <div key={t.id} className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{who[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-none">{who}</p>
                          <p className="text-sm text-muted-foreground">
                            {t.description} <span className="font-medium">· {t.status}</span>
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">{formatDate(t.dateline)}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Avance por proyecto */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Avance por Proyecto</CardTitle>
                <CardDescription>Tareas completadas sobre el total</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {projects.map((p) => {
                    const own = tasks.filter((t) => t.projectId === p.id)
                    const pct = projectProgress(p.id, tasks)
                    return (
                      <li key={p.id}>
                        <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                          <span className="truncate font-semibold">{p.title}</span>
                          <span className="shrink-0 font-mono text-xs text-muted-foreground">
                            {own.filter((t) => t.status === "Completado").length}/{own.length} · {pct}%
                          </span>
                        </div>
                        <div className="aero-progress"><span style={{ width: `${pct}%` }} /></div>
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* Tab: Projects */}
          <TabsContent value="projects" className="space-y-4">
            <ProjectsTab />
          </TabsContent>

          {/* Tab: Team */}
          <TabsContent value="team" className="space-y-4">
            <TeamTab />
          </TabsContent>

          {/* Tab: Tasks */}
          <TabsContent value="tasks" className="space-y-4">
            <TasksTable />
          </TabsContent>

          {/* Tab: Settings */}
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
