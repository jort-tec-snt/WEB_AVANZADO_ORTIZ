import { useEffect, useState } from 'react'
import { getToken } from '../api.js'

const STEPS = [
  ['git push', 'rama main'],
  ['GitHub Actions', 'workflow deploy'],
  ['Deploy Hook', 'secret en GitHub'],
  ['Render', 'build y despliegue'],
  ['Atlas', 'datos de usuarios'],
]

const ROUTES = [
  { path: 'GET /api/users/me', note: 'Tu perfil', roles: ['user', 'admin'] },
  { path: 'GET /api/users', note: 'Listar usuarios (solo admin)', roles: ['admin'] },
]

function tokenExpiry() {
  try {
    const payload = getToken().split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload)).exp ?? null
  } catch {
    return null
  }
}

function useHealth() {
  const [health, setHealth] = useState({ state: 'checking', ms: null })
  useEffect(() => {
    const started = performance.now()
    fetch('/health')
      .then(response => response.json().then(data => ({ ok: response.ok && data.ok })))
      .then(({ ok }) => setHealth({ state: ok ? 'ok' : 'bad', ms: Math.round(performance.now() - started) }))
      .catch(() => setHealth({ state: 'down', ms: null }))
  }, [])
  return health
}

function useCountdown(exp) {
  const [left, setLeft] = useState(() => (exp ? exp - Math.floor(Date.now() / 1000) : null))
  useEffect(() => {
    if (!exp) return undefined
    const id = setInterval(() => setLeft(exp - Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(id)
  }, [exp])
  return left
}

const HEALTH_LABEL = { checking: 'comprobando…', ok: 'En línea', bad: 'Con problemas', down: 'Sin conexión' }
const HEALTH_CLASS = { checking: '', ok: 'chip-ok', bad: 'chip-bad', down: 'chip-bad' }

export default function EnvPanel({ roles }) {
  const health = useHealth()
  const left = useCountdown(tokenExpiry())

  return (
    <section className="env-panel" id="entorno" aria-label="Estado del entorno">
      <h2 className="env-title">Entorno de despliegue</h2>

      <div className="env-grid">
        <div className="env-tile">
          <span className="env-label">API</span>
          <span className={`chip ${HEALTH_CLASS[health.state]}`}>{HEALTH_LABEL[health.state]}</span>
          <span className="env-note">{health.ms != null ? `${health.ms} ms` : ''}</span>
          <svg className="env-pulse" viewBox="0 0 260 34" aria-hidden="true">
            <polyline points="0,17 40,17 50,17 58,4 66,30 74,17 120,17 130,17 138,8 146,26 154,17 260,17" />
          </svg>
        </div>
        <div className="env-tile">
          <span className="env-label">Tu sesión (JWT)</span>
          <span className="chip chip-info">{roles.join(', ')}</span>
          <span className="env-note">
            {left == null ? '' : left > 0 ? `Expira en ${Math.floor(left / 60)} min ${left % 60} s` : 'Sesión expirada'}
          </span>
        </div>
        <div className="env-tile">
          <span className="env-label">Plataforma</span>
          <span className="chip chip-info">Render · Node · plan Free</span>
          <span className="env-note">Base de datos: MongoDB Atlas</span>
        </div>
      </div>

      <h3 className="env-sub">Flujo CI/CD</h3>
      <ol className="env-pipeline">
        {STEPS.map(([name, detail]) => (
          <li key={name}>
            <strong>{name}</strong>
            <span>{detail}</span>
          </li>
        ))}
      </ol>

      <h3 className="env-sub">Qué puede hacer tu rol</h3>
      <ul className="env-access">
        {ROUTES.map(route => {
          const allowed = route.roles.some(role => roles.includes(role))
          return (
            <li key={route.path} className={allowed ? 'yes' : 'no'}>
              <code>{route.path}</code>
              <span>{route.note}</span>
              <b>{allowed ? '200 permitido' : '403 prohibido'}</b>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
