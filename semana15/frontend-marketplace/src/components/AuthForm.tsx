'use client';

import Link from 'next/link';
import { useState } from 'react';
import { API_URL } from '@/lib/api';
import { saveToken } from '@/lib/session';
import { ApiResponse } from '@/types/product';
import { Session } from '@/types/user';

const COPY = {
  login: {
    eyebrow: 'Acceso',
    title: 'Iniciar sesión',
    submit: 'Ingresar',
    question: '¿No tienes cuenta?',
    href: '/register',
    link: 'Crear cuenta',
  },
  register: {
    eyebrow: 'Registro',
    title: 'Crear cuenta',
    submit: 'Registrarme',
    question: '¿Ya tienes cuenta?',
    href: '/login',
    link: 'Iniciar sesión',
  },
};

export default function AuthForm({ mode }: { mode: keyof typeof COPY }) {
  const copy = COPY[mode];
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data: ApiResponse<Session | null> = await res.json();
      if (!res.ok || !data.data) {
        setError(data.message);
        setSending(false);
        return;
      }
      saveToken(data.data.token);
      // Recarga completa intencional: descarta lo cacheado de la sesión anterior.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign('/');
    } catch {
      setError('No se pudo conectar con la API');
      setSending(false);
    }
  };

  const field = (
    name: keyof typeof formData,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
  ) => (
    <div>
      <label htmlFor={name} className="field-label">{label}</label>
      <input
        id={name}
        required
        value={formData[name]}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        className="field"
        {...props}
      />
    </div>
  );

  return (
    <div className="shell max-w-md py-12">
      <div className="sheet p-8">
        <p className="eyebrow mb-2">{copy.eyebrow}</p>
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight">{copy.title}</h1>

        {error && <p role="alert" className="notice mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' &&
            field('nombre', 'Nombre', { type: 'text', maxLength: 100, autoComplete: 'name' })}
          {field('email', 'Correo', { type: 'email', maxLength: 150, autoComplete: 'email' })}
          {field('password', 'Contraseña', {
            type: 'password',
            minLength: mode === 'register' ? 8 : undefined,
            maxLength: 72,
            autoComplete: mode === 'register' ? 'new-password' : 'current-password',
          })}
          <button type="submit" disabled={sending} className="btn-primary w-full">
            {sending ? 'Enviando…' : copy.submit}
          </button>
        </form>

        <p className="mt-6 text-sm">
          {copy.question}{' '}
          <Link href={copy.href} className="link">{copy.link}</Link>
        </p>
      </div>
    </div>
  );
}
