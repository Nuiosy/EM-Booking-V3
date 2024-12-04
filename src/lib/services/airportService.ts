import { useState, useEffect } from 'react'

export interface Airport {
  id: string
  ident: string
  type: string
  name: string
  latitude: number
  longitude: number
  elevation: number
  continent: string
  country: string
  region: string
  municipality: string
  scheduledService: boolean
  gpsCode: string
  iataCode: string
  localCode: string
  homeLink?: string
  wikipediaLink?: string
  keywords?: string[]
}

let airportsCache: Airport[] = []

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let currentValue = ''
  let insideQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      insideQuotes = !insideQuotes
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue.trim())
      currentValue = ''
    } else {
      currentValue += char
    }
  }
  
  values.push(currentValue.trim())
  return values.map(v => v.replace(/^"|"$/g, ''))
}

export async function loadAirports(): Promise<Airport[]> {
  try {
    // Only load if cache is empty
    if (airportsCache.length === 0) {
      const response = await fetch('/data/airports.csv')
      const csvText = await response.text()
      
      // Parse CSV (skip header row)
      const rows = csvText.split('\n').slice(1)
      airportsCache = rows
        .map(row => {
          const [
            id, ident, type, name, latitude, longitude, elevation,
            continent, country, region, municipality, scheduledService,
            gpsCode, iataCode, localCode, homeLink, wikipediaLink, keywords
          ] = parseCSVLine(row)

          return {
            id,
            ident,
            type,
            name,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            elevation: parseFloat(elevation),
            continent,
            country,
            region,
            municipality,
            scheduledService: scheduledService === 'yes',
            gpsCode,
            iataCode,
            localCode,
            homeLink: homeLink || undefined,
            wikipediaLink: wikipediaLink || undefined,
            keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined
          }
        })
        .filter(airport => 
          // Filter out airports without IATA codes and non-commercial airports
          airport.iataCode && 
          ['large_airport', 'medium_airport'].includes(airport.type)
        )
    }
    
    return airportsCache
  } catch (error) {
    console.error('Error loading airports:', error)
    return []
  }
}

export async function searchAirports(query: string): Promise<Airport[]> {
  const airports = await loadAirports()
  const searchTerm = query.toLowerCase()

  return airports.filter(airport => 
    airport.iataCode?.toLowerCase().includes(searchTerm) ||
    airport.name.toLowerCase().includes(searchTerm) ||
    airport.municipality.toLowerCase().includes(searchTerm) ||
    airport.country.toLowerCase().includes(searchTerm)
  )
}

export async function getAirportByCode(code: string): Promise<Airport | null> {
  const airports = await loadAirports()
  return airports.find(a => a.iataCode === code) || null
}

export function useAirports() {
  const [airports, setAirports] = useState<Airport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAirports() {
      try {
        setIsLoading(true)
        const data = await loadAirports()
        setAirports(data)
        setError(null)
      } catch (err) {
        setError('Failed to load airports')
        console.error('Error loading airports:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAirports()
  }, [])

  return { airports, isLoading, error }
}