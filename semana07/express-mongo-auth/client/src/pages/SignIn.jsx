import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authFetch, post, setToken } from '../api.js'
import { Field, Shell } from '../components/Shell.jsx'

export default function SignIn() {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true)
    setMessage('')
    try {
      const { token } = await post('/api/auth/signIn', { email: form.get('email'), password: form.get('password') })
      setToken(token)
      const user = await authFetch('/api/users/me')
      navigate(user.roles.includes('admin') ? '/admin/dashboard' : '/user/dashboard')
    } catch (error) {
      setMessage(error.message || 'Error de conexión. Inténtalo de nuevo')
      setBusy(false)
    }
  }

  return (
    <Shell>
      <div className="card narrow">
        <form className="card-content" onSubmit={onSubmit} noValidate>
          <h1 className="title center">Iniciar sesión</h1>
          <p className="subtitle center">Accede a tu cuenta</p>
          {message && <p className="msg err" role="status">{message}</p>}
          <Field id="email" label="Correo electrónico" type="email" required />
          <Field id="password" label="Contraseña" type="password" required />
          <button className="btn block" type="submit" disabled={busy}>{busy ? 'Entrando…' : 'Iniciar sesión'}</button>
        </form>
        <div className="card-action center">
          <Link to="/signUp">¿No tienes una cuenta? Regístrate</Link>
        </div>
      </div>
    </Shell>
  )
}
