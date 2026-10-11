import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { post } from '../api.js'
import { Field, Shell } from '../components/Shell.jsx'

const FIELDS = ['name', 'lastName', 'phoneNumber', 'birthdate', 'email', 'password']

export default function SignUp() {
  const [message, setMessage] = useState({ text: '', ok: false })
  const navigate = useNavigate()

  async function onSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      await post('/api/auth/signUp', Object.fromEntries(FIELDS.map(k => [k, form.get(k)])))
      setMessage({ text: 'Cuenta creada. Redirigiendo al inicio de sesión…', ok: true })
      setTimeout(() => navigate('/signIn'), 1500)
    } catch (error) {
      setMessage({ text: error.message || 'Error de conexión. Inténtalo de nuevo', ok: false })
    }
  }

  return (
    <Shell>
      <div className="card narrow">
        <form className="card-content" onSubmit={onSubmit} noValidate>
          <h1 className="title center">Crear cuenta</h1>
          <p className="subtitle center">Ingresa tus datos para registrarte</p>
          {message.text && <p className={`msg ${message.ok ? 'ok' : 'err'}`} role="status">{message.text}</p>}
          <Field id="name" label="Nombres" type="text" required />
          <Field id="lastName" label="Apellidos" type="text" required />
          <Field id="phoneNumber" label="Teléfono" type="tel" required />
          <Field id="birthdate" label="Fecha de nacimiento" type="date" required />
          <Field id="email" label="Correo electrónico" type="email" required />
          <Field id="password" label="Contraseña" type="password" required />
          <button className="btn block" type="submit">Crear cuenta</button>
        </form>
        <div className="card-action center">
          <Link to="/signIn">¿Ya tienes una cuenta? Inicia sesión</Link>
        </div>
      </div>
    </Shell>
  )
}
