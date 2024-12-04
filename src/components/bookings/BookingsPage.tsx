import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { 
  AlertCircle, 
  MoreHorizontal, 
  PlusIcon, 
  Search,
  Filter,
  Calendar,
  User,
  Plane,
  Hash,
  RefreshCw,
  FileText,
  Download,
  Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CustomerSelectionDialog } from './CustomerSelectionDialog'
import { BookingForm } from './BookingForm'
import { formatCurrency } from '@/lib/utils'
import type { Booking } from '@/types/booking'

interface SearchFilters {
  bookingNumber: string
  customerNumber: string
  customerName: string
  destination: string
  dateRange: string
  status: string
}

export function BookingsPage({ initialBookingId }: { initialBookingId?: string | null }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCustomerSelection, setShowCustomerSelection] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [deleteBookingId, setDeleteBookingId] = useState<string | null>(null)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    bookingNumber: '',
    customerNumber: '',
    customerName: '',
    destination: '',
    dateRange: '',
    status: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      let query = supabase
        .from('bookings')
        .select(`
          *,
          customer:customer_id (
            id,
            first_name,
            last_name,
            customer_number
          ),
          booking_flights!inner (
            id,
            from_code,
            from_name,
            from_time,
            to_code,
            to_name,
            to_time,
            carrier,
            flight_number,
            duration
          )
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (searchFilters.bookingNumber) {
        query = query.ilike('booking_number', `%${searchFilters.bookingNumber}%`)
      }
      if (searchFilters.customerName) {
        query = query.or(`customer.first_name.ilike.%${searchFilters.customerName}%,customer.last_name.ilike.%${searchFilters.customerName}%`)
      }
      if (searchFilters.customerNumber) {
        query = query.ilike('customer.customer_number', `%${searchFilters.customerNumber}%`)
      }
      if (searchFilters.status) {
        query = query.eq('status', searchFilters.status)
      }

      const { data, error } = await query

      if (error) throw error

      setBookings(data)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    fetchBookings()
  }

  const clearFilters = () => {
    setSearchFilters({
      bookingNumber: '',
      customerNumber: '',
      customerName: '',
      destination: '',
      dateRange: '',
      status: ''
    })
    fetchBookings()
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default'
      case 'draft':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const handleDeleteBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)

      if (error) throw error

      setDeleteBookingId(null)
      toast({
        title: "Success",
        description: "Booking has been deleted successfully",
        variant: "destructive"
      })

      fetchBookings()
    } catch (err) {
      console.error('Error deleting booking:', err)
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage and track all your travel bookings
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCustomerSelection(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Booking
          </Button>
          <Button variant="outline" onClick={() => fetchBookings()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Booking Number</Label>
                <div className="relative">
                  <Hash className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by booking number"
                    value={searchFilters.bookingNumber}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, bookingNumber: e.target.value }))}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer name"
                    value={searchFilters.customerName}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, customerName: e.target.value }))}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Customer Number</Label>
                <div className="relative">
                  <FileText className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer number"
                    value={searchFilters.customerNumber}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, customerNumber: e.target.value }))}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Destination</Label>
                <div className="relative">
                  <Plane className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by destination"
                    value={searchFilters.destination}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, destination: e.target.value }))}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={searchFilters.status}
                  onValueChange={(value) => setSearchFilters(prev => ({ ...prev, status: value === 'all' ? '' : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button className="flex-1" onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-8 w-8 animate-spin mr-2" />
                      <span>Loading bookings...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-4xl">📋</div>
                      <div className="text-lg font-medium">No bookings found</div>
                      <div className="text-sm text-muted-foreground">
                        Create a new booking or try different search filters
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id} className="group">
                    <TableCell className="font-medium">{booking.booking_number}</TableCell>
                    <TableCell>
                      {booking.customer?.first_name} {booking.customer?.last_name}
                      <div className="text-sm text-muted-foreground">
                        #{booking.customer?.customer_number}
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.booking_flights?.[0]?.to_name || 'Not specified'}
                    </TableCell>
                    <TableCell>{format(new Date(booking.start_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeleteBookingId(booking.id)}
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CustomerSelectionDialog
        open={showCustomerSelection}
        onOpenChange={setShowCustomerSelection}
        onSelect={(customerId) => {
          setShowCustomerSelection(false)
          // Handle customer selection
        }}
      />

      <AlertDialog open={!!deleteBookingId} onOpenChange={() => setDeleteBookingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteBookingId && handleDeleteBooking(deleteBookingId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}