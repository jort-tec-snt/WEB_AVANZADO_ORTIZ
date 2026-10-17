import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// GET /api/omdb?s=batman   -> búsqueda
// GET /api/omdb?i=tt0468569 -> detalle completo por id
export async function GET(request: NextRequest) {
  const apiKey = process.env.OMDB_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { Response: 'False', Error: 'Falta OMDB_API_KEY en .env.local' },
      { status: 500 }
    )
  }

  const { searchParams } = request.nextUrl
  const s = searchParams.get('s')
  const i = searchParams.get('i')

  if (!s && !i) {
    return NextResponse.json(
      { Response: 'False', Error: 'Debes enviar el parámetro s o i' },
      { status: 400 }
    )
  }

  // Solo reenviamos parámetros permitidos; axios se encarga de codificarlos
  const params: Record<string, string> = { apikey: apiKey }
  if (i) {
    params.i = i
    params.plot = 'full'
  } else if (s) {
    params.s = s
  }

  try {
    const { data } = await axios.get('https://www.omdbapi.com/', { params, timeout: 8000 })
    return NextResponse.json(data)
  } catch (e) {
    // OMDb respondió con un error (401 key inválida, límite diario, etc.): reenviamos su mensaje
    if (axios.isAxiosError(e) && e.response) {
      return NextResponse.json(e.response.data, { status: e.response.status })
    }
    // Aquí sí es un problema de red (DNS, timeout, etc.)
    return NextResponse.json(
      { Response: 'False', Error: 'No se pudo contactar a OMDb' },
      { status: 502 }
    )
  }
}
