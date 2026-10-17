import { connection } from 'next/server'
import { cacheLife } from 'next/cache'
import axios from 'axios'
import type { OmdbDetail, OmdbDetailResponse } from '@/lib/omdb'
import PopularShowcase from './PopularShowcase'

const POPULAR_IDS = [
  'tt0084787', // The Thing
  'tt0078748', // Alien
  'tt0081505', // The Shining
  'tt0114369', // Se7en
  'tt0070047', // The Exorcist
  'tt7784604', // Hereditary
  'tt1865505', // Mandy
  'tt0119081', // Event Horizon
  'tt0083907', // The Evil Dead
  'tt1392190', // Mad Max: Fury Road
  'tt0083658', // Blade Runner
  'tt0468569', // The Dark Knight
]

async function fetchMovie(id: string, apiKey: string): Promise<OmdbDetail | null> {
  try {
    const { data } = await axios.get<OmdbDetailResponse>('https://www.omdbapi.com/', {
      params: { apikey: apiKey, i: id },
      timeout: 8000,
    })
    return data.Response === 'True' ? data : null
  } catch {
    return null
  }
}

// Caché de servidor por horas: así las 12 peticiones no se repiten en cada recarga
async function getPopularMovies(apiKey: string): Promise<OmdbDetail[]> {
  'use cache'
  cacheLife('hours')

  const results = await Promise.all(POPULAR_IDS.map((id) => fetchMovie(id, apiKey)))
  const movies = results.filter((m): m is OmdbDetail => m !== null)
  // Si todo falló lanzamos error para que NO se guarde en caché un resultado vacío
  if (movies.length === 0) throw new Error('OMDb no devolvió películas')
  return movies
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-auto my-16 max-w-3xl border-2 border-[#5a0008] bg-[#0f0809] p-6 text-lg text-[#e9e1d0]">
      {children}
    </p>
  )
}

export default async function PopularMovies() {
  await connection() // se renderiza en cada visita; los datos salen de la caché

  const apiKey = process.env.OMDB_API_KEY
  if (!apiKey) {
    return (
      <Notice>
        Falta <code>OMDB_API_KEY</code> en <code>.env.local</code>. Reinicia <code>pnpm dev</code> después de crearla.
      </Notice>
    )
  }

  let movies: OmdbDetail[] = []
  try {
    movies = await getPopularMovies(apiKey)
  } catch {
    movies = []
  }

  if (movies.length === 0) {
    return <Notice>No se pudieron cargar las películas populares. Revisa tu API key y tu conexión.</Notice>
  }

  return <PopularShowcase movies={movies} />
}
