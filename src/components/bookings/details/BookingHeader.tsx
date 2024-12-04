import { Card, CardContent } from "@/components/ui/card"
import { Phone, Smartphone, Mail, User } from "lucide-react"

interface BookingHeaderProps {
  booking: {
    bookingNumber: string
    bookingDate: string
    customerName: string
    customerNumber: string
    phone: string
    mobile: string
    email: string
  }
}

export function BookingHeader({ booking }: BookingHeaderProps) {
  return (
    <Card className="mb-6">
      <CardContent className="grid grid-cols-4 gap-6 pt-6">
        <div>
          <div className="text-sm font-medium text-muted-foreground">Booking Number</div>
          <div className="text-lg font-semibold">{booking.bookingNumber}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Booking Date</div>
          <div className="text-lg font-semibold">{booking.bookingDate}</div>
        </div>
        <div className="col-span-2">
          <div className="text-sm font-medium text-muted-foreground">Customer</div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="text-lg font-semibold">{booking.customerName}</span>
            <span className="text-sm text-muted-foreground">#{booking.customerNumber}</span>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>{booking.phone}</span>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>{booking.mobile}</span>
          </div>
        </div>
        <div className="col-span-2">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>{booking.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}