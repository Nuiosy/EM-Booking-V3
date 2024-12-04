import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Search, Loader2 } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { CustomerSelectionDialog } from "../CustomerSelectionDialog"

interface AdditionalServicesProps {
  bookingId?: string
  customerId?: string
  onCustomerChange?: (customerId: string) => void
}

export function AdditionalServices({ bookingId, customerId, onCustomerChange }: AdditionalServicesProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const { toast } = useToast()
  const [bookingDetails, setBookingDetails] = useState({
    customerNumber: "",
    bookingDate: new Date().toISOString().split('T')[0],
    employee: "",
    tripType: "",
    isChecked: false,
    departureLocation: "",
    destination: "",
    country: ""
  })

  // Fetch customer data when customerId changes
  useEffect(() => {
    async function fetchCustomerData() {
      if (!customerId) return

      try {
        setIsLoading(true)
        const { data: customer, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .single()

        if (error) throw error

        if (customer) {
          setBookingDetails(prev => ({
            ...prev,
            customerNumber: customer.customer_number
          }))
        }
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

    fetchCustomerData()
  }, [customerId, toast])

  // Fetch booking data when bookingId changes
  useEffect(() => {
    async function fetchBookingData() {
      if (!bookingId) return

      try {
        setIsLoading(true)
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            *,
            customer:customers(*)
          `)
          .eq('id', bookingId)
          .single()

        if (bookingError) throw bookingError

        if (booking) {
          setBookingDetails(prev => ({
            ...prev,
            customerNumber: booking.customer?.customer_number || "",
            bookingDate: booking.start_date,
          }))
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch booking'
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookingData()
  }, [bookingId, toast])

  const handleCustomerSelect = async (customerId: string) => {
    try {
      // Update booking with new customer
      if (bookingId) {
        const { error } = await supabase
          .from('bookings')
          .update({ 
            customer_id: customerId,
            updated_at: new Date().toISOString()
          })
          .eq('id', bookingId)

        if (error) throw error
      }

      setShowCustomerDialog(false)
      onCustomerChange?.(customerId)

      toast({
        title: "Customer Updated",
        description: "The booking has been updated with the new customer."
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update customer'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {/* Customer and Booking Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Customer Number *</Label>
            <div className="flex space-x-2">
              {isLoading ? (
                <div className="flex-1 flex items-center space-x-2 h-10 px-3 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <Input
                  value={bookingDetails.customerNumber}
                  disabled
                  placeholder="No customer selected"
                  className="flex-1"
                />
              )}
              <Button
                variant="outline"
                onClick={() => setShowCustomerDialog(true)}
                disabled={isLoading}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Booking Date *</Label>
            <Input
              type="date"
              value={bookingDetails.bookingDate}
              onChange={(e) => setBookingDetails(prev => ({
                ...prev,
                bookingDate: e.target.value
              }))}
            />
          </div>
        </div>

        {/* Rest of the form fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Employee</Label>
            <Select
              value={bookingDetails.employee}
              onValueChange={(value) => setBookingDetails(prev => ({
                ...prev,
                employee: value
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john">John Smith</SelectItem>
                <SelectItem value="sarah">Sarah Johnson</SelectItem>
                <SelectItem value="michael">Michael Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type of Trip</Label>
            <Input
              value={bookingDetails.tripType}
              disabled
              placeholder="Automatically determined"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={bookingDetails.isChecked}
            onCheckedChange={(checked) => setBookingDetails(prev => ({
              ...prev,
              isChecked: checked
            }))}
          />
          <Label>Checked</Label>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Departure Location</Label>
            <Input
              value={bookingDetails.departureLocation}
              onChange={(e) => setBookingDetails(prev => ({
                ...prev,
                departureLocation: e.target.value
              }))}
              placeholder="Enter city"
            />
          </div>
          <div className="space-y-2">
            <Label>Travel Destination</Label>
            <Input
              value={bookingDetails.destination}
              onChange={(e) => setBookingDetails(prev => ({
                ...prev,
                destination: e.target.value
              }))}
              placeholder="Enter city"
            />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Input
              value={bookingDetails.country}
              onChange={(e) => setBookingDetails(prev => ({
                ...prev,
                country: e.target.value
              }))}
              placeholder="Enter country"
            />
          </div>
        </div>

        {/* Customer Selection Dialog */}
        <CustomerSelectionDialog
          open={showCustomerDialog}
          onOpenChange={setShowCustomerDialog}
          onSelect={handleCustomerSelect}
        />
      </CardContent>
    </Card>
  )
}