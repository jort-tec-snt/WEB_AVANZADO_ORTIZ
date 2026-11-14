"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Field from "@/components/Field";

const MESSAGES: Record<string, string> = {
  MISSING_FIELDS: "Ingresa tu correo y contraseña.",
  INVALID_CREDENTIALS: "Correo o contraseña incorrectos.",
  OAuthAccountNotLinked: "Ese correo ya está asociado a otro método de acceso.",
  AccessDenied: "Acceso denegado.",
};

// Traduce el codigo de error de authorize() a un mensaje para el usuario.
function toMessage(code: string) {
  if (code.startsWith("LOCKED:")) {
    return `Cuenta bloqueada por demasiados intentos. Intenta de nuevo en ${code.split(":")[1]} minuto(s).`;
  }
  if (code.startsWith("INVALID_CREDENTIALS:")) {
    return `Correo o contraseña incorrectos. Te quedan ${code.split(":")[1]} intento(s).`;
  }
  return MESSAGES[code] ?? "No se pudo iniciar sesión. Intenta nuevamente.";
}

// Solo rutas internas: evita open redirect con callbackUrl=//sitio-malo.com
const safeCallback = () => {
  const raw = new URLSearchParams(window.location.search).get("callbackUrl") ?? "";
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.ok) {
      router.push(safeCallback());
      router.refresh();
    } else {
      setError(toMessage(result?.error ?? ""));
    }
  };

  return (
    <div className="auth">
      <section className="auth__hero">
        <span className="orb orb--shield auth__orb" aria-hidden />
        <h1 className="auth__title">
          Tu puerta al <em>cielo</em> despejado.
        </h1>
        <p className="auth__lead">
          Inicia sesión con tu cuenta de Google o GitHub, o con tu correo. Las rutas privadas solo se abren con sesión
          activa.
        </p>
        <div className="auth__methods">
          <span className="chip">OAuth 2.0</span>
          <span className="chip">JWT</span>
          <span className="chip">bcrypt</span>
        </div>
      </section>

      <section className="panel glass" aria-labelledby="signin-title">
        <span className="panel__eyebrow">Sign In</span>
        <h2 id="signin-title" className="panel__title">
          Bienvenido de vuelta
        </h2>

        <form onSubmit={handleCredentials} className="panel__form">
          <Field label="Correo" name="email" type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          <Field label="Contraseña" name="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          {error && (
            <p role="alert" className="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} className="btn btn--block">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="divider">o continúa con</div>

        <button onClick={() => signIn("google", { callbackUrl: safeCallback() })} className="provider">
          <span className="provider__icon"><FaGoogle /></span> Continue with Google
        </button>
        <button onClick={() => signIn("github", { callbackUrl: safeCallback() })} className="provider provider--github">
          <span className="provider__icon"><FaGithub /></span> Continue with GitHub
        </button>

        <p className="panel__foot">
          ¿No tienes cuenta? <Link href="/register">Regístrate</Link>
        </p>
      </section>
    </div>
  );
}
