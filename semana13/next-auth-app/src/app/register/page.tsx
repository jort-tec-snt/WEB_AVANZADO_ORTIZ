"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Field from "@/components/Field";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "No se pudo crear la cuenta.");
      setLoading(false);
      return;
    }
    // Cuenta creada: inicia sesion automaticamente.
    const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    if (result?.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      router.push("/signIn");
    }
  };

  return (
    <div className="auth">
      <section className="auth__hero">
        <span className="orb orb--user auth__orb" aria-hidden />
        <h1 className="auth__title">
          Crea tu cuenta <em>en segundos</em>.
        </h1>
        <p className="auth__lead">
          Tu contraseña se cifra con bcrypt antes de guardarse y la cuenta se bloquea tras 5 intentos fallidos.
        </p>
        <div className="auth__methods">
          <span className="chip">bcrypt · 12 rondas</span>
          <span className="chip">Bloqueo 15 min</span>
        </div>
      </section>

      <section className="panel glass" aria-labelledby="register-title">
        <span className="panel__eyebrow">Registro</span>
        <h2 id="register-title" className="panel__title">
          Nueva cuenta
        </h2>
        <form onSubmit={handleSubmit} className="panel__form">
          <Field label="Nombre" name="name" placeholder="Tu nombre" value={form.name} onChange={set("name")} autoComplete="name" required />
          <Field label="Correo" name="email" type="email" placeholder="tu@correo.com" value={form.email} onChange={set("email")} autoComplete="email" required />
          <Field label="Contraseña" name="password" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={set("password")} autoComplete="new-password" minLength={8} required />
          <Field label="Confirmar contraseña" name="confirm" type="password" placeholder="Repite la contraseña" value={form.confirm} onChange={set("confirm")} autoComplete="new-password" required />
          {error && (
            <p role="alert" className="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} className="btn btn--leaf btn--block">
            {loading ? "Creando..." : "Registrarme"}
          </button>
        </form>
        <p className="panel__foot">
          ¿Ya tienes cuenta? <Link href="/signIn">Inicia sesión</Link>
        </p>
      </section>
    </div>
  );
}
