import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingHeader } from "./details/BookingHeader"
import { FlightDetails } from "./details/FlightDetails"
import { Card } from "@/components/ui/card"

const mockBooking = {
  bookingNumber: "B001",
  bookingDate: "2024-02-10",
  customerName: "John Doe",
  customerNumber: "C123456",
  phone: "+1 234-567-8900",
  mobile: "+1 234-567-8901",
  email: "john.doe@example.com"
}

export function BookingDetails() {
  return (
    <div className="space-y-6">
      <BookingHeader booking={mockBooking} />
      
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <Tabs defaultValue="flights" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="flights">Flights</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="car">Rent a Car</TabsTrigger>
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
              <TabsTrigger value="services">Additional Services</TabsTrigger>
            </TabsList>
            <TabsContent value="flights" className="mt-6">
              <FlightDetails />
            </TabsContent>
            <TabsContent value="hotels">
              <Card className="p-6">Hotel booking content</Card>
            </TabsContent>
            <TabsContent value="car">
              <Card className="p-6">Car rental content</Card>
            </TabsContent>
            <TabsContent value="transfer">
              <Card className="p-6">Transfer content</Card>
            </TabsContent>
            <TabsContent value="services">
              <Card className="p-6">Additional services content</Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="payments" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="data">Booking Data</TabsTrigger>
              <TabsTrigger value="controlling">Controlling</TabsTrigger>
            </TabsList>
            <TabsContent value="payments">
              <Card className="p-6">Payment details</Card>
            </TabsContent>
            <TabsContent value="data">
              <Card className="p-6">Booking data</Card>
            </TabsContent>
            <TabsContent value="controlling">
              <Card className="p-6">Controlling info</Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}