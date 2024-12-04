import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Plane, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isAfter, subDays, parseISO } from "date-fns"
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FlightOption {
  id: string
  bookingId: string
  bookingNumber: string
  customerName: string
  from: {
    code: string
    name: string
    city: string
    country: string
  }
  to: {
    code: string
    name: string
    city: string
    country: string
  }
  carrier: string
  flightNumber: string
  duration: string
  baggage: string
  option: {
    date: string
    price: number
    expiryDate: string
  }
}

interface FlightOptionsProps {
  className?: string
  limit?: number
}

export function FlightOptions({ className, limit }: FlightOptionsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState<FlightOption[]>([])
  const [showAllDialog, setShowAllDialog] = useState(false)
  const { toast } = useToast()

  const fetchFlightOptions = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_number,
          customer:customers(
            id,
            salutation,
            first_name,
            last_name,
            customer_number
          ),
          flights:booking_flights(
            id,
            date,
            from_code,
            from_name,
            from_time,
            from_city,
            from_country,
            to_code,
            to_name,
            to_time,
            to_city,
            to_country,
            carrier,
            flight_number,
            duration,
            baggage,
            arrival_date,
            organizer,
            travel_reason,
            travel_status,
            processing_status,
            comments,
            option_date,
            option_price,
            option_expiry,
            pnr,
            price
          )
        `)
        .not('flights', 'is', null)
        .order('created_at', { ascending: false })

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError)
        throw bookingsError
      }

      if (!bookingsData) {
        console.error('No booking data received')
        throw new Error('No booking data received')
      }

      // Transform and filter data
      const flightOptions: FlightOption[] = (bookingsData || [])
        .flatMap(booking => 
          (booking.flights || [])
            .filter((flight: any) => {
              // Check if all required option fields are present
              const hasOptionFields = flight.option_date && 
                                  flight.option_price && 
                                  flight.option_expiry
              
              // Check if the option hasn't expired
              const isNotExpired = flight.option_expiry && 
                               new Date(flight.option_expiry) > new Date()

              return hasOptionFields && isNotExpired
            })
            .map((flight: any) => ({
              id: flight.id,
              bookingId: booking.id,
              bookingNumber: booking.booking_number,
              customerName: booking.customer ? 
                `${booking.customer.salutation} ${booking.customer.first_name} ${booking.customer.last_name}` :
                'Unknown Customer',
              from: {
                code: flight.from_code,
                name: flight.from_name,
                city: flight.from_city,
                country: flight.from_country
              },
              to: {
                code: flight.to_code,
                name: flight.to_name,
                city: flight.to_city,
                country: flight.to_country
              },
              carrier: flight.carrier,
              flightNumber: flight.flight_number,
              duration: flight.duration,
              baggage: flight.baggage,
              option: {
                date: flight.option_date,
                price: flight.option_price,
                expiryDate: flight.option_expiry
              }
            }))
        )
        .sort((a, b) => 
          parseISO(a.option.expiryDate).getTime() - parseISO(b.option.expiryDate).getTime()
        )

      console.log('Transformed flight options:', flightOptions)
      setOptions(flightOptions)
    } catch (err) {
      console.error('Error in fetchFlightOptions:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch flight options'
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

  // Initial fetch and real-time subscription
  useEffect(() => {
    let channel: any = null

    const initializeSubscription = async () => {
      try {
        await fetchFlightOptions()

        channel = supabase
          .channel('flight-options-changes')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'booking_flights' 
            }, 
            () => {
              fetchFlightOptions()
            }
          )
          .subscribe()
      } catch (error) {
        console.error('Error setting up subscription:', error)
      }
    }

    initializeSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  const handleFlightClick = (bookingId: string) => {
    window.dispatchEvent(new CustomEvent('navigateToBooking', { 
      detail: { bookingId } 
    }))
  }

  const displayOptions = limit ? options.slice(0, limit) : options

  const OptionsList = ({ options }: { options: FlightOption[] }) => (
    <div className="space-y-4">
      {options.map((flight) => {
        const isNearExpiry = isAfter(new Date(), subDays(parseISO(flight.option.expiryDate), 2))

        return (
          <Button
            key={flight.id}
            variant="outline"
            className={cn(
              "w-full justify-start text-left h-auto p-4",
              isNearExpiry && "border-destructive"
            )}
            onClick={() => handleFlightClick(flight.bookingId)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="space-y-1">
                <div className="font-medium">{flight.customerName}</div>
                <div className="text-sm text-muted-foreground">#{flight.bookingNumber}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Plane className="h-4 w-4 mr-2" />
                  {flight.from.code} → {flight.to.code}
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={isNearExpiry ? "destructive" : "secondary"}
                  className="mb-1"
                >
                  {isNearExpiry && <AlertCircle className="h-3 w-3 mr-1" />}
                  Expires {format(parseISO(flight.option.expiryDate), 'MMM d')}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  €{flight.option.price.toFixed(2)}
                </div>
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px] text-destructive">
        <AlertCircle className="h-4 w-4 mr-2" />
        {error}
      </div>
    )
  }

  if (options.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No flight options available
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Active Options</h3>
          {options.length > (limit || 0) && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAllDialog(true)}
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
        <ScrollArea className={cn("pr-4", className)}>
          <OptionsList options={displayOptions} />
        </ScrollArea>
      </div>

      <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>All Flight Options</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[600px] pr-4">
            <OptionsList options={options} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}