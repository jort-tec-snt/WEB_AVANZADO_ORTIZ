import { Link, useNavigate } from 'react-router-dom'
import { clearToken } from '../api.js'

export function Shell({ children }) {
  return (
    <>
      <div className="reel-topbar">
        THE UNDERGROUND REEL<small>// archivo de cine de terror</small>
      </div>
      <main className="container">{children}</main>
    </>
  )
}

export function Nav({ reviews }) {
  return (
    <nav className="reel-nav" aria-label="Secciones">
      <a href="#entorno">ENTORNO</a>
      {reviews && <a href="#resenas">RESEÑAS</a>}
      <Link to="/profile">PERFIL</Link>
    </nav>
  )
}

export function LogoutButton() {
  const navigate = useNavigate()
  const logout = () => {
    clearToken()
    navigate('/signIn')
  }
  return (
    <button type="button" className="btn" onClick={logout}>
      Cerrar sesión
    </button>
  )
}

export function Field({ label, id, ...props }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} {...props} />
    </div>
  )
}
