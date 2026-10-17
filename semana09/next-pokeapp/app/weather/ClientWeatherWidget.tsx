'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface WeatherData {
  current_weather: {
    temperature: number
    windspeed: number
    weathercode: number
  }
}

const cities = {
  Tokyo: { lat: 35.6762, lon: 139.6503 },
  'New York': { lat: 40.7128, lon: -74.006 },
  London: { lat: 51.5074, lon: -0.1278 },
  Sydney: { lat: -33.8688, lon: 151.2093 },
}

type CityName = keyof typeof cities

export default function ClientWeatherWidget() {
  const [city, setCity] = useState<CityName>('Tokyo')
  // Guardamos la ciudad junto con los datos: así "loading" se deduce sin setState síncrono en el effect
  const [result, setResult] = useState<{ city: CityName; data: WeatherData } | null>(null)

  const loading = result === null || result.city !== city

  useEffect(() => {
    let cancelled = false

    const fetchWeather = async () => {
      const coords = cities[city]
      const response = await axios.get<WeatherData>(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`
      )
      if (!cancelled) setResult({ city, data: response.data })
    }

    fetchWeather()
    return () => {
      cancelled = true // evita pisar datos si el usuario cambia de ciudad rápido
    }
  }, [city])

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-6 border-4 border-white">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        <h2 className="text-2xl font-bold text-gray-800">Mundo - CSR</h2>
      </div>

      <select
        value={city}
        onChange={(e) => setCity(e.target.value as CityName)}
        className="text-gray-500 w-full p-3 mb-4 border-2 border-gray-300 rounded-lg font-semibold hover:border-blue-500 transition"
      >
        {(Object.keys(cities) as CityName[]).map((c) => (
          <option className="text-gray-500" key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <>
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {result.data.current_weather.temperature}°C
          </div>
          <p className="text-gray-600">Viento: {result.data.current_weather.windspeed} km/h</p>
        </>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
        <p className="text-xs text-blue-800">🔄 Datos actualizados dinámicamente - Interactividad total</p>
      </div>
    </div>
  )
}
