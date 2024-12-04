export interface HotelGuest {
  id: string
  firstName: string
  lastName: string
  type: 'adult' | 'child' | 'baby'
  age?: number
}

export interface Hotel {
  id: string
  name: string
  location: string
  accommodation: string // e.g., "Double Room", "Suite"
  mealPlan: string // e.g., "All Inclusive", "Half Board"
  checkIn: string
  checkOut: string
  organizer: string
  guests: {
    adults: number
    children: number
    babies: number
  }
  assignedGuests: HotelGuest[]
  pricing: {
    netPrice: number
    grossPrice: number
  }
}