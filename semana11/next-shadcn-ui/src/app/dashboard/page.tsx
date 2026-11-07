"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProjectForm } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TasksTable"
import { ProjectsTab } from "@/components/dashboard/ProjectsTab"
import { TeamTab } from "@/components/dashboard/TeamTab"
import { Hero } from "@/components/aero/Hero"
import { StatCard } from "@/components/dashboard/StatCard"
import { useData } from "@/lib/data-context"

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

            {/* Recent Activity */}
            <Card>
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
                        <div className="text-sm text-muted-foreground">{t.dateline}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
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
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Tareas</CardTitle>
                <CardDescription>
                  Administra todas las tareas de tus proyectos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TasksTable />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>
                  Administra las preferencias de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configuración en desarrollo...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
