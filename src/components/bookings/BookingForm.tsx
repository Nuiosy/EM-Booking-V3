import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Phone, Smartphone, Mail, User, Loader2 } from "lucide-react"
import { FlightDetails } from "./details/FlightDetails"
import { HotelDetails } from "./details/HotelDetails"
import { ParticipantDetails } from "./details/ParticipantDetails"
import { PaymentDetails } from "./details/PaymentDetails"
import { AdditionalServices } from "./details/AdditionalServices"
import { BookingFinancials } from "./details/BookingFinancials"
import { ControllingTab } from "./details/ControllingTab"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

interface Customer {
  id: string
  salutation: string
  first_name: string
  last_name: string
  email: string
  phone: string
  mobile: string | null
  customer_number: string
}

interface BookingFormProps {
  booking?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function BookingForm({ booking, onSubmit, onCancel }: BookingFormProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Fetch customer data when booking changes
  useEffect(() => {
    async function fetchCustomer() {
      if (!booking?.customer_id) return

      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', booking.customer_id)
          .single()

        if (error) throw error
        setCustomer(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch customer'
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomer()
  }, [booking?.customer_id, toast])

  const handleCustomerChange = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single()

      if (error) throw error
      setCustomer(data)

      // Update booking with new customer
      if (booking?.id) {
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ customer_id: customerId })
          .eq('id', booking.id)

        if (updateError) throw updateError
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update customer'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  // Check if any flight has an expiring option
  const hasExpiringOption = booking?.flights?.some((flight: any) => 
    flight.option && new Date(flight.option.expiryDate) > new Date()
  )

  const expiringFlight = booking?.flights?.find((flight: any) => 
    flight.option && new Date(flight.option.expiryDate) > new Date()
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={onCancel}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
        </div>
        <Button onClick={() => onSubmit(booking)}>
          Save Changes
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Booking {booking ? booking.booking_number : "New Booking"}
        </h2>
        <p className="text-muted-foreground mt-1">
          View and manage booking details
        </p>
      </div>

      {/* Option Expiry Alert */}
      {hasExpiringOption && expiringFlight && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Flight option for {expiringFlight.from.code} → {expiringFlight.to.code} expires on {format(new Date(expiringFlight.option.expiryDate), 'MMM d, yyyy')}. 
            Please take action soon!
          </AlertDescription>
        </Alert>
      )}

      {/* Customer Overview */}
      <Card>
        <CardContent className="grid grid-cols-4 gap-6 pt-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Booking Number</div>
            <div className="text-lg font-semibold">{booking?.booking_number || "New Booking"}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Booking Date</div>
            <div className="text-lg font-semibold">
              {booking?.start_date ? format(new Date(booking.start_date), 'MMM d, yyyy') : format(new Date(), 'MMM d, yyyy')}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-sm font-medium text-muted-foreground">Customer</div>
            {isLoading ? (
              <div className="flex items-center space-x-2 mt-1">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading customer data...</span>
              </div>
            ) : customer ? (
              <div className="flex items-center space-x-2 mt-1">
                <User className="h-4 w-4" />
                <span className="text-lg font-semibold">
                  {customer.salutation} {customer.first_name} {customer.last_name}
                </span>
                <span className="text-sm text-muted-foreground">
                  #{customer.customer_number}
                </span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground mt-1">
                No customer selected
              </div>
            )}
          </div>

          {customer && (
            <>
              <div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span>{customer.mobile || 'N/A'}</span>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-6">
        <Tabs defaultValue="flights" className="w-full">
          <TabsList className="w-full justify-start border-b">
            <TabsTrigger value="flights" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Flights</TabsTrigger>
            <TabsTrigger value="hotels" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Hotels</TabsTrigger>
            <TabsTrigger value="participants" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Travel Participants</TabsTrigger>
            <TabsTrigger value="car" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Rent a Car</TabsTrigger>
            <TabsTrigger value="transfer" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Transfer</TabsTrigger>
            <TabsTrigger value="services" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Additional Services</TabsTrigger>
          </TabsList>
          <TabsContent value="flights" className="mt-6">
            <FlightDetails bookingId={booking?.id} />
          </TabsContent>
          <TabsContent value="hotels" className="mt-6">
            <HotelDetails />
          </TabsContent>
          <TabsContent value="participants" className="mt-6">
            <ParticipantDetails />
          </TabsContent>
          <TabsContent value="services" className="mt-6">
            <AdditionalServices 
              bookingId={booking?.id} 
              customerId={booking?.customer_id}
              onCustomerChange={handleCustomerChange}
            />
          </TabsContent>
          <TabsContent value="car">
            <Card className="p-6">Car rental content</Card>
          </TabsContent>
          <TabsContent value="transfer">
            <Card className="p-6">Transfer content</Card>
          </TabsContent>
        </Tabs>

        {/* Payment and Additional Info Tabs */}
        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="w-full justify-start border-b">
            <TabsTrigger value="payments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Payments</TabsTrigger>
            <TabsTrigger value="data" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Booking Data</TabsTrigger>
            <TabsTrigger value="controlling" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Controlling</TabsTrigger>
          </TabsList>
          <TabsContent value="payments">
            <PaymentDetails />
          </TabsContent>
          <TabsContent value="data">
            <Card className="p-6">Booking data content</Card>
          </TabsContent>
          <TabsContent value="controlling">
            <div className="space-y-6">
              <BookingFinancials
                totalSales={booking?.totalAmount || 0}
                totalPurchase={booking?.purchaseAmount || 0}
                totalPaid={booking?.paidAmount || 0}
                totalOutstanding={(booking?.totalAmount || 0) - (booking?.paidAmount || 0)}
              />
              <ControllingTab
                bookingId={booking?.id}
                flights={booking?.flights || []}
                hotels={booking?.hotels || []}
                onSave={(entry) => {
                  // Handle saving purchase entry
                  console.log('Purchase entry:', entry)
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit(booking)}>Save Changes</Button>
      </div>
    </div>
  )
}