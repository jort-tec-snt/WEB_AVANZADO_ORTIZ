export interface OmdbSearchItem {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export type OmdbSearchResponse =
  | { Response: 'True'; Search: OmdbSearchItem[]; totalResults: string }
  | { Response: 'False'; Error: string }

export interface OmdbDetail {
  Response: 'True'
  imdbID: string
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  imdbRating: string
  imdbVotes: string
  Type: string
  totalSeasons?: string
}

export type OmdbDetailResponse = OmdbDetail | { Response: 'False'; Error: string }

// OMDb devuelve el texto "N/A" cuando no hay póster
export const hasPoster = (poster: string) => poster !== 'N/A'

// OMDb entrega miniaturas (SX300); pedimos una versión más grande para el carrusel
export const bigPoster = (poster: string) => poster.replace(/_SX\d+/, '_SX700')

// Traduce el tipo que devuelve OMDb
export const typeLabel = (type: string) =>
  ({ movie: 'Película', series: 'Serie', episode: 'Episodio', game: 'Videojuego' } as Record<string, string>)[type] ?? type
