import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authFetch } from '../api.js'
import { useMe } from '../hooks.js'
import { Field, LogoutButton, Shell } from '../components/Shell.jsx'

const EDITABLE = ['name', 'lastName', 'phoneNumber', 'birthdate', 'url_profile', 'address']

export default function Profile() {
  const { user, setUser, error } = useMe()
  const [message, setMessage] = useState({ text: '', ok: false })

  async function onSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      const updated = await authFetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(EDITABLE.map(k => [k, form.get(k)]))),
      })
      setUser(updated)
      setMessage({ text: 'Perfil actualizado correctamente', ok: true })
    } catch (err) {
      setMessage({ text: err.message, ok: false })
    }
  }

  const back = user?.roles.includes('admin') ? '/admin/dashboard' : '/user/dashboard'

  return (
    <Shell>
      <div className="card">
        <div className="card-content">
          <h1 className="title">Mi perfil</h1>
          <p className="subtitle">Consulta y actualiza tus datos personales</p>
          {error && <p className="msg err">{error}</p>}
          {message.text && <p className={`msg ${message.ok ? 'ok' : 'err'}`} role="status">{message.text}</p>}
          {!user && !error && <p role="status">Cargando tu perfil…</p>}
          {user && (
            <>
              <ul className="list">
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Edad:</strong> {user.age}</li>
                <li><strong>Roles:</strong> {user.roles.join(', ')}</li>
              </ul>
              <form key={user.updatedAt} onSubmit={onSubmit} noValidate>
                <div className="two-col">
                  <Field id="name" label="Nombre" type="text" defaultValue={user.name} required />
                  <Field id="lastName" label="Apellido" type="text" defaultValue={user.lastName} required />
                  <Field id="phoneNumber" label="Teléfono" type="tel" defaultValue={user.phoneNumber} required />
                  <Field id="birthdate" label="Fecha de nacimiento" type="date" defaultValue={(user.birthdate || '').slice(0, 10)} required />
                </div>
                <Field id="url_profile" label="URL de perfil" type="url" defaultValue={user.url_profile ?? ''} />
                <Field id="address" label="Dirección" type="text" defaultValue={user.address ?? ''} />
                <button className="btn" type="submit">Guardar cambios</button>
              </form>
            </>
          )}
        </div>
        <div className="card-action">
          <Link to={back}>Volver al dashboard</Link>
          <LogoutButton />
        </div>
      </div>
    </Shell>
  )
}
