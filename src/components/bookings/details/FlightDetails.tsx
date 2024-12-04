import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2 } from "lucide-react"
import { FlightCard } from "./FlightCard"
import { FlightForm } from "./FlightForm"
import { Flight } from "@/types/flight"
import { useBookingFlights } from "@/lib/hooks/useBookingFlights"

interface FlightDetailsProps {
  bookingId?: string
}

export function FlightDetails({ bookingId }: FlightDetailsProps) {
  const [isAddingFlight, setIsAddingFlight] = useState(false)
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null)
  
  const {
    flights,
    isLoading,
    addFlight,
    updateFlight,
    deleteFlight
  } = useBookingFlights(bookingId)

  const handleAddFlight = async (data: Partial<Flight>) => {
    const newFlight = await addFlight(data)
    if (newFlight) {
      setIsAddingFlight(false)
    }
  }

  const handleEditFlight = async (data: Partial<Flight>) => {
    if (!editingFlight?.id) return

    const updatedFlight = await updateFlight(editingFlight.id, data)
    if (updatedFlight) {
      setEditingFlight(null)
    }
  }

  if (!bookingId) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Please save the booking first to add flights.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Flight Details</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setIsAddingFlight(true)}
          disabled={isAddingFlight || !!editingFlight}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Flight
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {flights.map((flight) => (
            !editingFlight || editingFlight.id !== flight.id ? (
              <FlightCard
                key={flight.id}
                flight={flight}
                onEdit={setEditingFlight}
                onDelete={deleteFlight}
              />
            ) : (
              <FlightForm
                key={flight.id}
                initialData={flight}
                onSubmit={handleEditFlight}
                onCancel={() => setEditingFlight(null)}
              />
            )
          ))}

          {isAddingFlight && (
            <FlightForm
              onSubmit={handleAddFlight}
              onCancel={() => setIsAddingFlight(false)}
            />
          )}

          {!isAddingFlight && flights.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              No flights added yet. Click "Add Flight" to get started.
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}