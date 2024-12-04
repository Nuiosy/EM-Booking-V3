import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Flight } from '@/types/flight'
import { fetchFlightDetails, transformFlightData } from '@/lib/utils/flightDataTransformer'
import { useToast } from '@/components/ui/use-toast'

export function useBookingFlights(bookingId?: string) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const refreshFlights = async () => {
    if (!bookingId) return

    try {
      setIsLoading(true)
      setError(null)
      const flights = await fetchFlightDetails(bookingId)
      setFlights(flights)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch flights'
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshFlights()

    // Subscribe to flight changes
    const channel = supabase
      .channel(`booking-flights-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'booking_flights',
          filter: `booking_id=eq.${bookingId}`
        },
        () => {
          refreshFlights()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [bookingId])

  const addFlight = async (data: Partial<Flight>) => {
    if (!bookingId) return null

    try {
      const { data: newFlight, error } = await supabase
        .from('booking_flights')
        .insert({
          booking_id: bookingId,
          date: data.date,
          from_code: data.from?.code,
          from_name: data.from?.name,
          from_time: data.from?.time,
          from_city: data.from?.city,
          from_country: data.from?.country,
          to_code: data.to?.code,
          to_name: data.to?.name,
          to_time: data.to?.time,
          to_city: data.to?.city,
          to_country: data.to?.country,
          carrier: data.carrier,
          flight_number: data.flightNumber,
          duration: data.duration,
          baggage: data.baggage,
          arrival_date: data.arrivalDate,
          organizer: data.organizer,
          travel_reason: data.travelReason,
          travel_status: data.travelStatus,
          processing_status: data.processingStatus,
          comments: data.comments,
          option_date: data.option?.date,
          option_price: data.option?.price,
          option_expiry: data.option?.expiryDate,
          pnr: data.pnr,
          price: data.price
        })
        .select()
        .single()

      if (error) throw error

      const transformedFlight = transformFlightData(newFlight)
      setFlights(prev => [...prev, transformedFlight])
      
      toast({
        title: "Success",
        description: "Flight added successfully"
      })

      return transformedFlight
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add flight'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      return null
    }
  }

  const updateFlight = async (flightId: string, data: Partial<Flight>) => {
    try {
      if (!flightId) {
        throw new Error('Flight ID is required')
      }

      const { data: updatedFlight, error } = await supabase
        .from('booking_flights')
        .update({
          date: data.date,
          from_code: data.from?.code,
          from_name: data.from?.name,
          from_time: data.from?.time,
          from_city: data.from?.city,
          from_country: data.from?.country,
          to_code: data.to?.code,
          to_name: data.to?.name,
          to_time: data.to?.time,
          to_city: data.to?.city,
          to_country: data.to?.country,
          carrier: data.carrier,
          flight_number: data.flightNumber,
          duration: data.duration,
          baggage: data.baggage,
          arrival_date: data.arrivalDate,
          organizer: data.organizer,
          travel_reason: data.travelReason,
          travel_status: data.travelStatus,
          processing_status: data.processingStatus,
          comments: data.comments,
          option_date: data.option?.date,
          option_price: data.option?.price,
          option_expiry: data.option?.expiryDate,
          pnr: data.pnr,
          price: data.price
        })
        .eq('id', flightId)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Failed to update flight in database')
      }

      if (!updatedFlight) {
        throw new Error('No flight was updated. The flight might not exist.')
      }

      const transformed = transformFlightData(updatedFlight)
      toast({
        title: "Success",
        description: "Flight updated successfully",
      })
      return transformed
    } catch (error) {
      console.error('Update flight error:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while updating the flight'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    }
  }

  const deleteFlight = async (id: string) => {
    try {
      const { error } = await supabase
        .from('booking_flights')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Immediately update the local state
      setFlights(prev => prev.filter(flight => flight.id !== id))
      
      toast({
        title: "Success",
        description: "Flight deleted successfully"
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete flight'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      return false
    }
  }

  return {
    flights,
    isLoading,
    error,
    addFlight,
    updateFlight,
    deleteFlight,
    refreshFlights
  }
}