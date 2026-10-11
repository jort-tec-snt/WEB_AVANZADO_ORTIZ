import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch, clearToken } from './api.js'

// Carga el usuario autenticado; sin sesión válida redirige a /signIn.
export function useMe() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    authFetch('/api/users/me')
      .then(setUser)
      .catch(err => {
        if (err.status === 401) {
          clearToken()
          navigate('/signIn')
        } else {
          setError(err.message)
        }
      })
  }, [navigate])

  return { user, setUser, error }
}
