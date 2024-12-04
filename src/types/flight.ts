export interface FlightLocation {
  code: string
  name: string
  time: string
  city: string
  country: string
}

export interface FlightOption {
  date: string
  price: number
  expiryDate: string
}

export interface Flight {
  id: string
  date: string
  from: FlightLocation
  to: FlightLocation
  carrier: string
  flightNumber: string
  duration: string
  baggage: string
  arrivalDate: string
  organizer: string
  travelReason: string
  travelStatus: string
  processingStatus: string
  comments: string
  option?: FlightOption
  pnr?: string
  price?: number
}