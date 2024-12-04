import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { HotelCard } from "./HotelCard"
import { HotelForm } from "./HotelForm"
import { Hotel } from "@/types/hotel"
import { useToast } from "@/components/ui/use-toast"

const initialHotels: Hotel[] = [
  {
    id: "1",
    name: "Grand Hotel Barcelona",
    location: "Barcelona, Spain",
    accommodation: "Deluxe Double Room",
    mealPlan: "Half Board",
    checkIn: "2024-02-15",
    checkOut: "2024-02-20",
    organizer: "TUI",
    guests: {
      adults: 2,
      children: 1,
      babies: 0
    },
    assignedGuests: [
      { id: "g1", firstName: "John", lastName: "Doe", type: "adult" },
      { id: "g2", firstName: "Jane", lastName: "Doe", type: "adult" },
      { id: "g3", firstName: "Billy", lastName: "Doe", type: "child", age: 8 }
    ],
    pricing: {
      netPrice: 800,
      grossPrice: 920
    }
  }
]

export function HotelDetails() {
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels)
  const [isAddingHotel, setIsAddingHotel] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const { toast } = useToast()

  const handleAddHotel = (data: Partial<Hotel>) => {
    const newHotel = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    } as Hotel
    
    setHotels([...hotels, newHotel])
    setIsAddingHotel(false)
    toast({
      title: "Hotel Added",
      description: `${data.name} has been added successfully.`
    })
  }

  const handleEditHotel = (data: Partial<Hotel>) => {
    if (editingHotel) {
      setHotels(hotels.map(h => 
        h.id === editingHotel.id ? { ...h, ...data } : h
      ))
      setEditingHotel(null)
      toast({
        title: "Hotel Updated",
        description: `${data.name} has been updated successfully.`
      })
    }
  }

  const handleDeleteHotel = (id: string) => {
    const hotelToDelete = hotels.find(h => h.id === id)
    if (window.confirm(`Are you sure you want to delete ${hotelToDelete?.name}?`)) {
      setHotels(hotels.filter(h => h.id !== id))
      toast({
        title: "Hotel Deleted",
        description: `${hotelToDelete?.name} has been deleted.`,
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Hotel Details</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setIsAddingHotel(true)}
          disabled={isAddingHotel || !!editingHotel}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Hotel
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {hotels.map((hotel) => (
            !editingHotel || editingHotel.id !== hotel.id ? (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onEdit={setEditingHotel}
                onDelete={handleDeleteHotel}
              />
            ) : (
              <HotelForm
                key={hotel.id}
                initialData={hotel}
                onSubmit={handleEditHotel}
                onCancel={() => setEditingHotel(null)}
              />
            )
          ))}

          {isAddingHotel && (
            <HotelForm
              onSubmit={handleAddHotel}
              onCancel={() => setIsAddingHotel(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}