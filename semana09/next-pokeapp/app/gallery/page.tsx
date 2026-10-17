import type { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import './metal.css'
import { fraktur, fell } from './fonts'
import PopularMovies from './PopularMovies'
import MovieSearch from './MovieSearch'

export const metadata: Metadata = {
  title: 'CryptaCine',
  description: 'Galería de películas y series con Next.js (SSR + CSR) y la API de OMDb.',
}

export default function GalleryPage() {
  return (
    <main id="top" className={`crypt ${fraktur.variable} ${fell.variable}`}>
      <header className="crypt-header">
        <nav className="crypt-nav" aria-label="Secciones">
          <a href="#relicario">Populares</a>
          <a href="#buscar">Buscar</a>
        </nav>
        <h1 className="crypt-logo">
          <Image
            src="/brand/cryptacine-logo.webp"
            alt="CryptaCine"
            width={1024}
            height={572}
            unoptimized
            loading="eager"
            fetchPriority="high"
          />
        </h1>
        <p className="crypt-tagline">
          Clásicos del terror y la oscuridad. Haz clic en una portada del anillo para girarlo, o en la del frente para
          abrir su ficha.
        </p>
      </header>

      <section id="relicario">
        <Suspense fallback={<div className="h-[560px] animate-pulse" />}>
          <PopularMovies />
        </Suspense>
      </section>

      <section id="buscar" className="crypt-section">
        <h2 className="crypt-h2">Buscar en la cripta</h2>
        <p className="crypt-lead">Cualquier película o serie de OMDb. Elige un resultado para ver su ficha completa.</p>
        <MovieSearch />
      </section>

      <footer className="crypt-footer">
        Datos de OMDb API. Laboratorio 09 de Desarrollo de Aplicaciones Web Avanzado, Tecsup.
      </footer>
    </main>
  )
}
