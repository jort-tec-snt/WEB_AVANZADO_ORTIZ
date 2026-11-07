"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectForm } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TasksTable"
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "E-commerce Platform",
                  description: "Plataforma de comercio electrónico con Next.js",
                  status: "En progreso",
                  progress: 65,
                  team: 5,
                },
                {
                  title: "Mobile App",
                  description: "Aplicación móvil con React Native",
                  status: "En revisión",
                  progress: 90,
                  team: 3,
                },
                {
                  title: "Dashboard Analytics",
                  description: "Panel de análisis con visualizaciones",
                  status: "Planificado",
                  progress: 20,
                  team: 4,
                },
                {
                  title: "API Gateway",
                  description: "Microservicios con Node.js",
                  status: "En progreso",
                  progress: 45,
                  team: 6,
                },
                {
                  title: "Design System",
                  description: "Librería de componentes reutilizables",
                  status: "Completado",
                  progress: 100,
                  team: 2,
                },
                {
                  title: "Marketing Website",
                  description: "Sitio web institucional",
                  status: "En progreso",
                  progress: 75,
                  team: 3,
                },
              ].map((project, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          project.status === "Completado"
                            ? "default"
                            : project.status === "En revisión"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          {project.team} miembros
                        </div>
                        <Button size="sm" variant="ghost">
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Team */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Miembros del Equipo</CardTitle>
                <CardDescription>
                  Gestiona los miembros de tu equipo y sus roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "María García", role: "Frontend Developer", email: "maria@example.com", status: "Activo" },
                    { name: "Juan Pérez", role: "Backend Developer", email: "juan@example.com", status: "Activo" },
                    { name: "Ana López", role: "UI/UX Designer", email: "ana@example.com", status: "Ausente" },
                    { name: "Carlos Ruiz", role: "DevOps Engineer", email: "carlos@example.com", status: "Activo" },
                    { name: "Laura Martínez", role: "Project Manager", email: "laura@example.com", status: "Activo" },
                  ].map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={member.status === "Activo" ? "default" : "secondary"}>
                          {member.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
