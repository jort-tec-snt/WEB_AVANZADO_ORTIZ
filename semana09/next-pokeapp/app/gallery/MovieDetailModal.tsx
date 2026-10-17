'use client'
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { hasPoster, bigPoster, typeLabel, type OmdbDetail, type OmdbDetailResponse } from '@/lib/omdb'

interface Props {
  imdbID: string
  initial?: OmdbDetail // si ya tenemos el detalle, no se vuelve a pedir
  onClose: () => void
}

export default function MovieDetailModal({ imdbID, initial, onClose }: Props) {
  const [detail, setDetail] = useState<OmdbDetail | null>(initial ?? null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initial) return
    let cancelled = false

    const fetchDetail = async () => {
      try {
        const { data } = await axios.get<OmdbDetailResponse>('/api/omdb', { params: { i: imdbID } })
        if (cancelled) return
        if (data.Response === 'True') setDetail(data)
        else setError(data.Error)
      } catch {
        if (!cancelled) setError('No se pudo abrir la ficha. Revisa tu conexión e inténtalo de nuevo.')
      }
    }

    fetchDetail()
    return () => {
      cancelled = true
    }
  }, [imdbID, initial])

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Solo mostramos los datos que OMDb sí tiene ("N/A" = no disponible)
  const facts: Array<[string, string | undefined]> = detail
    ? [
        ['Tipo', typeLabel(detail.Type)],
        ['Estreno', detail.Released],
        ['Duración', detail.Runtime],
        ['Clasificación', detail.Rated],
        ['Temporadas', detail.totalSeasons],
        ['Dirección', detail.Director],
        ['Guion', detail.Writer],
        ['Reparto', detail.Actors],
        ['Idioma', detail.Language],
        ['País', detail.Country],
        ['Premios', detail.Awards],
      ]
    : []

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={detail ? `Ficha de ${detail.Title}` : 'Ficha'}
      className="ficha-backdrop"
      onClick={onClose}
    >
      <div className="ficha" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="btn-quiet ficha-close">
          Cerrar
        </button>

        {error ? (
          <p className="ficha-msg">{error}</p>
        ) : !detail ? (
          <div className="ficha-msg">
            <div className="spinner mx-auto" />
            <p>Abriendo la ficha…</p>
          </div>
        ) : (
          <div className="ficha-grid">
            <div className="ficha-poster">
              {hasPoster(detail.Poster) ? (
                <img src={bigPoster(detail.Poster)} alt={`Póster de ${detail.Title}`} />
              ) : (
                <div className="urn-empty">💀</div>
              )}
            </div>

            <div>
              <h2 className="ficha-title">{detail.Title}</h2>
              <p className="ficha-genre">
                {detail.Genre}, {detail.Year}
              </p>
              <p className="ficha-rating">
                <strong>{detail.imdbRating}</strong> en IMDb, con {detail.imdbVotes} votos
              </p>
              <p>{detail.Plot}</p>
              <dl className="ficha-facts">
                {facts
                  .filter(([, value]) => value && value !== 'N/A')
                  .map(([label, value]) => (
                    <div key={label} className="contents">
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
