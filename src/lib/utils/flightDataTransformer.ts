import { supabase } from '@/lib/supabase'
import { getAirportByCode } from '@/lib/services/airportService'
import type { Flight } from '@/types/flight'

export interface RawFlightData {
  id: string
  booking_id: string
  date: string
  from_code: string
  from_name: string
  from_time: string
  from_city: string
  from_country: string
  to_code: string
  to_name: string
  to_time: string
  to_city: string
  to_country: string
  carrier: string
  flight_number: string
  duration: string
  baggage: string
  arrival_date: string
  organizer: string
  travel_reason?: string
  travel_status?: string
  processing_status?: string
  comments?: string
  option_date?: string
  option_price?: number
  option_expiry?: string
  pnr?: string
  price?: number
}

export async function transformFlightData(rawFlight: RawFlightData): Promise<Flight> {
  // Fetch airport details
  const fromAirport = await getAirportByCode(rawFlight.from_code || '')
  const toAirport = await getAirportByCode(rawFlight.to_code || '')

  return {
    id: rawFlight.id,
    date: rawFlight.date,
    from: {
      code: rawFlight.from_code || '',
      name: fromAirport?.name || rawFlight.from_name || '',
      time: rawFlight.from_time || '',
      city: fromAirport?.municipality || rawFlight.from_city || '',
      country: fromAirport?.country || rawFlight.from_country || ''
    },
    to: {
      code: rawFlight.to_code || '',
      name: toAirport?.name || rawFlight.to_name || '',
      time: rawFlight.to_time || '',
      city: toAirport?.municipality || rawFlight.to_city || '',
      country: toAirport?.country || rawFlight.to_country || ''
    },
    carrier: rawFlight.carrier || 'Unknown Carrier',
    flightNumber: rawFlight.flight_number || 'N/A',
    duration: rawFlight.duration || 'N/A',
    baggage: rawFlight.baggage || 'N/A',
    arrivalDate: rawFlight.arrival_date || rawFlight.date,
    organizer: rawFlight.organizer || 'N/A',
    travelReason: rawFlight.travel_reason || '',
    travelStatus: rawFlight.travel_status || 'New',
    processingStatus: rawFlight.processing_status || 'New',
    comments: rawFlight.comments || '',
    option: rawFlight.option_date ? {
      date: rawFlight.option_date,
      price: rawFlight.option_price || 0,
      expiryDate: rawFlight.option_expiry || rawFlight.option_date
    } : undefined,
    pnr: rawFlight.pnr,
    price: rawFlight.price
  }
}

export async function fetchFlightDetails(bookingId: string): Promise<Flight[]> {
  try {
    const { data, error } = await supabase
      .from('booking_flights')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Transform each flight data asynchronously
    const transformedFlights = await Promise.all(
      (data || []).map(flight => transformFlightData(flight))
    )

    return transformedFlights
  } catch (error) {
    console.error('Error fetching flight details:', error)
    return []
  }
}