export const CARRIERS = [
  "Lufthansa",
  "Air France",
  "British Airways",
  "KLM",
  "Swiss",
  "Austrian Airlines",
  "Eurowings",
  "Ryanair",
  "easyJet",
  "Condor",
  "TUI fly",
  "SunExpress",
  "Turkish Airlines",
  "Emirates",
  "Qatar Airways"
].sort()

export const ORGANIZERS = [
  "TUI",
  "DER Touristik",
  "FTI",
  "Schauinsland-Reisen",
  "alltours",
  "AIDA",
  "Direct Booking",
  "Expedia",
  "Booking.com",
  "Thomas Cook",
  "DERTOUR",
  "Meiers Weltreisen",
  "JAHN Reisen"
].sort()

export const TRAVEL_STATUSES = [
  "New",
  "Confirmed",
  "Waitlist",
  "Cancelled",
  "Completed",
  "On Hold",
  "Pending Confirmation"
].sort()

export const PROCESSING_STATUSES = [
  "New",
  "In Progress",
  "Pending Payment",
  "Ticketed",
  "Documents Sent",
  "Completed",
  "Cancelled"
].sort()

// Helper function to calculate flight duration
export function calculateFlightDuration(departureTime: string, arrivalTime: string, date: string, arrivalDate: string): string {
  const [departureHours, departureMinutes] = departureTime.split(':').map(Number)
  const [arrivalHours, arrivalMinutes] = arrivalTime.split(':').map(Number)
  
  const departure = new Date(date)
  departure.setHours(departureHours, departureMinutes)
  
  const arrival = new Date(arrivalDate)
  arrival.setHours(arrivalHours, arrivalMinutes)
  
  const diffInMinutes = Math.round((arrival.getTime() - departure.getTime()) / (1000 * 60))
  const hours = Math.floor(diffInMinutes / 60)
  const minutes = diffInMinutes % 60
  
  return `${hours}h ${minutes}m`
}

// Helper function to format date
export function formatDate(date: string): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Helper function to format time
export function formatTime(time: string): string {
  if (!time) return ''
  return time.padStart(5, '0') // Ensures HH:MM format
}

// Helper function to parse user input date
export function parseUserDate(input: string): string | null {
  // Remove any non-numeric characters
  const numbers = input.replace(/\D/g, '')
  
  if (numbers.length < 6) return null
  
  const day = numbers.slice(0, 2)
  const month = numbers.slice(2, 4)
  const year = numbers.length >= 8 ? numbers.slice(4, 8) : `20${numbers.slice(4, 6)}`
  
  // Validate date
  const date = new Date(`${year}-${month}-${day}`)
  if (isNaN(date.getTime())) return null
  
  return `${year}-${month}-${day}`
}

// Helper function to parse user input time
export function parseUserTime(input: string): string | null {
  // Remove any non-numeric characters
  const numbers = input.replace(/\D/g, '')
  
  if (numbers.length < 4) return null
  
  const hours = numbers.slice(0, 2)
  const minutes = numbers.slice(2, 4)
  
  // Validate time
  if (parseInt(hours) > 23 || parseInt(minutes) > 59) return null
  
  return `${hours}:${minutes}`
}