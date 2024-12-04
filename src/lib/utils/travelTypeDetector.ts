import { agencySettingsStore } from "@/lib/stores/agencySettingsStore"

interface Flight {
  from: {
    code: string
  }
  to: {
    code: string
  }
}

interface Booking {
  flights?: Flight[]
  hotels?: any[]
  carRental?: any
  transfer?: any
}

export function detectTravelType(booking: Booking): string {
  const { settings } = agencySettingsStore.getState()
  
  // Helper function to check if airport is in EU
  const isEUAirport = (code: string) => {
    const airport = settings.airports.find(a => a.code === code)
    return airport?.isEU ?? false
  }

  // Helper function to check if airport is domestic
  const isDomesticAirport = (code: string) => {
    const airport = settings.airports.find(a => a.code === code)
    return airport?.country === settings.country
  }

  // Check if booking has flights
  if (booking.flights && booking.flights.length > 0) {
    const flight = booking.flights[0] // Consider first flight for simplicity
    const fromEU = isEUAirport(flight.from.code)
    const toEU = isEUAirport(flight.to.code)
    const isDomestic = isDomesticAirport(flight.from.code) && isDomesticAirport(flight.to.code)

    // Check if it's a package tour first
    if (booking.hotels && booking.hotels.length > 0) {
      return "Package Tour"
    }

    // Then check flight types
    if (isDomestic) {
      return "Domestic Flight"
    }

    if (fromEU && toEU) {
      return "EU Flight"
    }

    if ((fromEU && !toEU) || (!fromEU && toEU)) {
      return "Third Country Flight"
    }
  }

  // Check other booking types
  if (booking.hotels && booking.hotels.length > 0 && (!booking.flights || booking.flights.length === 0)) {
    return "Hotel Only"
  }

  if (booking.carRental && (!booking.flights || booking.flights.length === 0) && (!booking.hotels || booking.hotels.length === 0)) {
    return "Rent a Car"
  }

  if (booking.transfer && (!booking.flights || booking.flights.length === 0) && (!booking.hotels || booking.hotels.length === 0)) {
    return "Transfer"
  }

  return "Unknown"
}