const KEY = 'token'

export const getToken = () => sessionStorage.getItem(KEY)
export const setToken = token => sessionStorage.setItem(KEY, token)
export const clearToken = () => sessionStorage.removeItem(KEY)

async function parse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw Object.assign(new Error(data.message || 'No se pudo completar la solicitud'), { status: response.status })
  }
  return data
}

export const post = (url, body) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(parse)

export async function authFetch(url, options = {}) {
  const token = getToken()
  if (!token) throw Object.assign(new Error('Inicia sesión para continuar'), { status: 401 })
  const response = await fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } })
  return parse(response)
}
