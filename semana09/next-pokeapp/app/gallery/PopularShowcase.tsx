'use client'
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, type CSSProperties } from 'react'
import { hasPoster, bigPoster, type OmdbDetail } from '@/lib/omdb'
import MovieDetailModal from './MovieDetailModal'

const AUTO_MS = 5000

export default function PopularShowcase({ movies }: { movies: OmdbDetail[] }) {
  const n = movies.length
  // "step" crece sin límite: así el anillo siempre gira hacia adelante, sin rebobinar
  const [step, setStep] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const active = ((step % n) + n) % n
  const movie = movies[active]
  const paused = hovered || selectedId !== null
  const stepAngle = 360 / n
  // Radio del anillo: geometría de un polígono regular de n lados (+ margen entre portadas)
  const radiusFactor = n > 2 ? 0.5 / Math.tan(Math.PI / n) + 0.25 : 0.8

  // Gira por el camino más corto hasta la portada i
  const goTo = (i: number) =>
    setStep((s) => {
      const current = ((s % n) + n) % n
      let d = (i - current) % n
      if (d > n / 2) d -= n
      if (d < -n / 2) d += n
      return s + d
    })

  // Flechas del teclado (no actúan mientras escribes ni con la ficha abierta)
  useEffect(() => {
    if (selectedId || n < 2) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (e.key === 'ArrowRight') setStep((s) => s + 1)
      if (e.key === 'ArrowLeft') setStep((s) => s - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [n, selectedId])

  return (
    <>
      <div
        className={paused ? 'is-paused' : undefined}
        style={{ '--auto-ms': `${AUTO_MS}ms` } as CSSProperties}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="reliquary" aria-roledescription="carrusel" aria-label="Películas populares">
          <div
            className="ring"
            style={
              {
                '--angle': `${-step * stepAngle}deg`,
                '--radius': `calc(var(--card-w) * ${radiusFactor})`,
              } as CSSProperties
            }
          >
            {movies.map((m, i) => {
              const raw = Math.abs(i - active)
              const dist = Math.min(raw, n - raw) // distancia en el anillo hasta el frente
              const isFront = dist === 0
              return (
                <button
                  key={m.imdbID}
                  className={`niche ${isFront ? 'is-front' : ''}`}
                  style={
                    {
                      '--a': `${i * stepAngle}deg`,
                      '--gray': isFront ? 0 : 1,
                      '--bright': Math.max(0.25, 1 - dist * 0.18),
                    } as CSSProperties
                  }
                  onClick={() => (isFront ? setSelectedId(m.imdbID) : goTo(i))}
                  aria-label={isFront ? `Abrir la ficha de ${m.Title}` : `Girar hasta ${m.Title}`}
                  tabIndex={dist <= 1 ? 0 : -1}
                >
                  {hasPoster(m.Poster) ? (
                    <img src={bigPoster(m.Poster)} alt="" draggable={false} />
                  ) : (
                    <span className="niche-empty">💀</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="plaque" key={movie.imdbID}>
          <p className="plaque-pos">
            {active + 1} de {n}
          </p>
          <h2 className="plaque-title">{movie.Title}</h2>
          <dl className="plaque-facts">
            <div>
              <dt>Año</dt>
              <dd>{movie.Year}</dd>
            </div>
            <div>
              <dt>Duración</dt>
              <dd>{movie.Runtime}</dd>
            </div>
            <div>
              <dt>Clasificación</dt>
              <dd>{movie.Rated}</dd>
            </div>
            <div className="rating">
              <dt>IMDb</dt>
              <dd>{movie.imdbRating}</dd>
            </div>
          </dl>
          <p className="plaque-genre">{movie.Genre}</p>
          <p className="plaque-plot">{movie.Plot}</p>
          <div className="plaque-actions">
            <button className="btn-quiet" onClick={() => setStep((s) => s - 1)}>
              Anterior
            </button>
            <button className="btn-bone" onClick={() => setSelectedId(movie.imdbID)}>
              Abrir ficha
            </button>
            <button className="btn-quiet" onClick={() => setStep((s) => s + 1)}>
              Siguiente
            </button>
          </div>
          {/* Al terminar esta línea de progreso, el anillo gira a la siguiente */}
          <span className="plaque-progress" aria-hidden="true">
            <i key={step} onAnimationEnd={() => setStep((s) => s + 1)} />
          </span>
        </div>
      </div>

      {selectedId && (
        <MovieDetailModal
          key={selectedId}
          imdbID={selectedId}
          initial={movies.find((m) => m.imdbID === selectedId)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  )
}
