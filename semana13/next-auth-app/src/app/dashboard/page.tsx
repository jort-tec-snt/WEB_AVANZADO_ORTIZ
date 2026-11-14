import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

const PROVIDERS: Record<string, string> = { google: "Google", github: "GitHub", credentials: "Correo y contraseña" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signIn");

  const provider = PROVIDERS[session.user.provider ?? ""] ?? "Desconocido";

  return (
    <div className="page">
      <section className="welcome glass">
        <span className="orb orb--user welcome__orb" aria-hidden />
        <div>
          <span className="chip">Sesión activa</span>
          <h1 className="welcome__title">
            Bienvenido, <span>{session.user.name}</span>
          </h1>
          <p className="tile__hint">Esta página solo se abre con sesión iniciada.</p>
        </div>
      </section>

      <section className="grid">
        <article className="tile glass">
          <span className="tile__label">Método de acceso</span>
          <span className="tile__value">{provider}</span>
          <p className="tile__hint">Proveedor con el que iniciaste sesión.</p>
        </article>
        <article className="tile glass">
          <span className="tile__label">Sesión</span>
          <span className="tile__value">JWT</span>
          <p className="tile__hint">Firmado con NEXTAUTH_SECRET, sin sesión en servidor.</p>
        </article>
        <article className="tile glass">
          <span className="tile__label">Correo</span>
          <span className="tile__value">{session.user.email ?? "—"}</span>
          <p className="tile__hint">Identidad asociada a la sesión.</p>
        </article>
      </section>

      <section className="routes glass" aria-label="Mapa de rutas">
        <span className="tile__label">Mapa de rutas</span>
        {ROUTES.protected.map((r) => (
          <div key={r} className="routes__row"><code>{r}</code><span>Privada · requiere sesión</span></div>
        ))}
        {ROUTES.guestOnly.map((r) => (
          <div key={r} className="routes__row"><code>{r}</code><span>Solo invitados · redirige al dashboard</span></div>
        ))}
      </section>
    </div>
  );
}
