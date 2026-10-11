import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { authFetch } from '../api.js'
import { useMe } from '../hooks.js'
import { LogoutButton, Nav, Shell } from '../components/Shell.jsx'
import EnvPanel from '../components/EnvPanel.jsx'
import Reviews from '../components/Reviews.jsx'

const HEADERS = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Edad', 'Rol', 'Fecha de registro']

function UsersTable() {
  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    authFetch('/api/users').then(setUsers).catch(err => setError(err.message))
  }, [])

  if (error) return <p className="msg err">{error}</p>
  if (!users) return <p role="status">Cargando usuarios…</p>
  if (users.length === 0) return <p className="msg ok">No hay usuarios registrados</p>
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{HEADERS.map(h => <th key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id ?? u.email}>
              <td>{u.name}</td>
              <td>{u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.phoneNumber}</td>
              <td>{u.age}</td>
              <td>{u.roles.join(', ')}</td>
              <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-PE') : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Dashboard({ admin }) {
  const { user, error } = useMe()

  if (user && admin && !user.roles.includes('admin')) return <Navigate to="/403" replace />

  return (
    <Shell>
      <Nav reviews={!admin} />
      <div className="card">
        <div className="card-content">
          <h1 className="title">{admin ? 'Administración' : 'Mi cuenta'}</h1>
          <p className="subtitle">{admin ? 'Usuarios registrados' : 'Bienvenido a tu dashboard'}</p>
          {error && <p className="msg err">{error}</p>}
          {!user && !error && <p role="status">Cargando…</p>}
          {user && (
            <>
              {admin ? (
                <UsersTable />
              ) : (
                <ul className="list">
                  <li><strong>Nombre:</strong> {user.name}</li>
                  <li><strong>Apellido:</strong> {user.lastName}</li>
                  <li><strong>Email:</strong> {user.email}</li>
                  <li><strong>Teléfono:</strong> {user.phoneNumber}</li>
                  <li><strong>Edad:</strong> {user.age}</li>
                  <li><strong>Rol:</strong> {user.roles.join(', ')}</li>
                </ul>
              )}
              <EnvPanel roles={user.roles} />
              {!admin && <Reviews />}
            </>
          )}
        </div>
        <div className="card-action">
          <Link to="/profile">Mi perfil</Link>
          <LogoutButton />
        </div>
      </div>
    </Shell>
  )
}
