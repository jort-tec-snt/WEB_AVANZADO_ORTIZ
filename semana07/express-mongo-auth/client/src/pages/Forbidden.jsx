import { Link } from 'react-router-dom'
import { Shell } from '../components/Shell.jsx'

export default function Forbidden() {
  return (
    <Shell>
      <div className="card narrow">
        <div className="card-content">
          <h1 className="title">403 - Acceso denegado</h1>
          <p>No tienes permisos suficientes para acceder a esta página.</p>
          <Link className="btn" to="/user/dashboard">Volver</Link>
        </div>
      </div>
    </Shell>
  )
}
