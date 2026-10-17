'use client'
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { hasPoster, typeLabel, type OmdbSearchItem, type OmdbSearchResponse } from '@/lib/omdb'
import MovieDetailModal from './MovieDetailModal'

interface SearchResult {
  query: string
  items: OmdbSearchItem[]
  total: number
  error: string | null
}

// Mensajes de OMDb traducidos a algo que el usuario entienda y pueda corregir
function friendlyError(message: string) {
  if (message === 'Movie not found!') return 'No hay nada enterrado con ese nombre. Prueba con otro título.'
  if (message === 'Too many results.') return 'Hay demasiados resultados. Escribe un título más específico.'
  return message
}

export default function MovieSearch() {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [result, setResult] = useState<SearchResult | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const hasQuery = debounced.length >= 3
  const current = hasQuery && result?.query === debounced ? result : null
  const loading = hasQuery && current === null

  // 1) Debounce: espera 500 ms sin teclear antes de buscar
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 500)
    return () => clearTimeout(timer)
  }, [query])

  // 2) Busca cuando el texto se estabiliza
  useEffect(() => {
    if (debounced.length < 3) return
    let cancelled = false

    const search = async () => {
      try {
        const { data } = await axios.get<OmdbSearchResponse>('/api/omdb', { params: { s: debounced } })
        if (cancelled) return
        if (data.Response === 'True') {
          setResult({ query: debounced, items: data.Search, total: Number(data.totalResults), error: null })
        } else {
          setResult({ query: debounced, items: [], total: 0, error: data.Error })
        }
      } catch (e) {
        if (cancelled) return
        const message =
          axios.isAxiosError(e) && e.response?.data?.Error
            ? String(e.response.data.Error)
            : 'No se pudo conectar con el buscador. Revisa tu conexión.'
        setResult({ query: debounced, items: [], total: 0, error: message })
      }
    }

    search()
    return () => {
      cancelled = true
    }
  }, [debounced])

  let status: React.ReactNode = 'Escribe al menos 3 letras. Los resultados aparecen mientras escribes.'
  if (loading) status = (<><span className="spinner" /> Buscando «{debounced}»…</>)
  else if (current?.error) status = friendlyError(current.error)
  else if (current)
    status =
      current.total > current.items.length
        ? `${current.total} resultados para «${current.query}». Se muestran los primeros ${current.items.length}.`
        : `${current.total} ${current.total === 1 ? 'resultado' : 'resultados'} para «${current.query}».`

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Título de una película o serie"
        aria-label="Buscar película o serie"
        className="grave-input"
      />

      <p className="search-status" aria-live="polite">
        {status}
      </p>

      {current && current.items.length > 0 && (
        <div className="columbarium">
          {current.items.map((item) => (
            <button key={item.imdbID} className="urn" onClick={() => setSelectedId(item.imdbID)}>
              <span className="urn-frame">
                {hasPoster(item.Poster) ? (
                  <img src={item.Poster} alt="" />
                ) : (
                  <span className="urn-empty">💀</span>
                )}
              </span>
              <span className="urn-title">{item.Title}</span>
              <span className="urn-meta">
                {typeLabel(item.Type)}, {item.Year}
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedId && (
        <MovieDetailModal key={selectedId} imdbID={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}
