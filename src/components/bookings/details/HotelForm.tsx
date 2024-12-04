import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Hotel, HotelGuest } from "@/types/hotel"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface HotelFormProps {
  onSubmit: (data: Partial<Hotel>) => void
  onCancel: () => void
  initialData?: Hotel
}

const organizers = ["TUI", "Expedia", "Booking.com", "Direct"]
const accommodationTypes = [
  "Single Room",
  "Double Room",
  "Triple Room",
  "Suite",
  "Family Room",
  "Apartment"
]
const mealPlans = [
  "Room Only",
  "Bed & Breakfast",
  "Half Board",
  "Full Board",
  "All Inclusive"
]

export function HotelForm({ onSubmit, onCancel, initialData }: HotelFormProps) {
  const [formData, setFormData] = useState<Partial<Hotel>>({
    name: initialData?.name || "",
    location: initialData?.location || "",
    accommodation: initialData?.accommodation || "",
    mealPlan: initialData?.mealPlan || "",
    checkIn: initialData?.checkIn || "",
    checkOut: initialData?.checkOut || "",
    organizer: initialData?.organizer || "",
    guests: initialData?.guests || {
      adults: 1,
      children: 0,
      babies: 0
    },
    assignedGuests: initialData?.assignedGuests || [],
    pricing: initialData?.pricing || {
      netPrice: 0,
      grossPrice: 0
    }
  })

  const [newGuest, setNewGuest] = useState<Partial<HotelGuest>>({
    firstName: "",
    lastName: "",
    type: "adult",
    age: undefined
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGuestCountChange = (type: 'adults' | 'children' | 'babies', value: number) => {
    setFormData(prev => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: Math.max(0, value)
      }
    }))
  }

  const handlePriceChange = (type: 'netPrice' | 'grossPrice', value: string) => {
    const numValue = parseFloat(value) || 0
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing!,
        [type]: numValue
      }
    }))
  }

  const addGuest = () => {
    if (newGuest.firstName && newGuest.lastName) {
      const guest: HotelGuest = {
        id: Math.random().toString(36).substr(2, 9),
        firstName: newGuest.firstName,
        lastName: newGuest.lastName,
        type: newGuest.type as 'adult' | 'child' | 'baby',
        age: newGuest.type === 'child' ? newGuest.age : undefined
      }
      setFormData(prev => ({
        ...prev,
        assignedGuests: [...(prev.assignedGuests || []), guest]
      }))
      setNewGuest({
        firstName: "",
        lastName: "",
        type: "adult",
        age: undefined
      })
    }
  }

  const removeGuest = (guestId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedGuests: prev.assignedGuests?.filter(g => g.id !== guestId) || []
    }))
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.location || !formData.checkIn || !formData.checkOut) {
      alert("Please fill in all required fields")
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-lg font-medium mb-4">
        {initialData ? "Edit Hotel" : "Add New Hotel"}
      </h3>
      <div className="space-y-6">
        {/* Basic Hotel Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Hotel Name</Label>
            <Input 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter hotel name"
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input 
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, Country"
            />
          </div>
        </div>

        {/* Accommodation Details */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Accommodation Type</Label>
            <Select 
              value={formData.accommodation}
              onValueChange={(value) => handleInputChange('accommodation', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {accommodationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Meal Plan</Label>
            <Select 
              value={formData.mealPlan}
              onValueChange={(value) => handleInputChange('mealPlan', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meal plan" />
              </SelectTrigger>
              <SelectContent>
                {mealPlans.map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {plan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Organizer</Label>
            <Select 
              value={formData.organizer}
              onValueChange={(value) => handleInputChange('organizer', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select organizer" />
              </SelectTrigger>
              <SelectContent>
                {organizers.map((org) => (
                  <SelectItem key={org} value={org}>
                    {org}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Check-in Date</Label>
            <Input 
              type="date"
              value={formData.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
            />
          </div>
          <div>
            <Label>Check-out Date</Label>
            <Input 
              type="date"
              value={formData.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
            />
          </div>
        </div>

        {/* Guest Numbers */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Adults</Label>
            <Input 
              type="number"
              min="1"
              value={formData.guests?.adults}
              onChange={(e) => handleGuestCountChange('adults', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label>Children</Label>
            <Input 
              type="number"
              min="0"
              value={formData.guests?.children}
              onChange={(e) => handleGuestCountChange('children', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label>Babies</Label>
            <Input 
              type="number"
              min="0"
              value={formData.guests?.babies}
              onChange={(e) => handleGuestCountChange('babies', parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Net Price</Label>
            <Input 
              type="number"
              min="0"
              step="0.01"
              value={formData.pricing?.netPrice}
              onChange={(e) => handlePriceChange('netPrice', e.target.value)}
            />
          </div>
          <div>
            <Label>Gross Price</Label>
            <Input 
              type="number"
              min="0"
              step="0.01"
              value={formData.pricing?.grossPrice}
              onChange={(e) => handlePriceChange('grossPrice', e.target.value)}
            />
          </div>
        </div>

        {/* Assigned Guests */}
        <div>
          <Label>Assigned Guests</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.assignedGuests?.map((guest) => (
              <Badge 
                key={guest.id}
                variant={
                  guest.type === 'adult' ? 'default' :
                  guest.type === 'child' ? 'secondary' : 'outline'
                }
                className="flex items-center gap-1"
              >
                {guest.firstName} {guest.lastName}
                {guest.age ? ` (${guest.age})` : ''}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeGuest(guest.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2">
                Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Guest</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={newGuest.firstName}
                      onChange={(e) => setNewGuest(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={newGuest.lastName}
                      onChange={(e) => setNewGuest(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={newGuest.type}
                      onValueChange={(value) => setNewGuest(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adult">Adult</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="baby">Baby</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newGuest.type === 'child' && (
                    <div>
                      <Label>Age</Label>
                      <Input
                        type="number"
                        min="2"
                        max="17"
                        value={newGuest.age}
                        onChange={(e) => setNewGuest(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      />
                    </div>
                  )}
                </div>
                <Button onClick={addGuest} className="w-full">
                  Add Guest
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? "Update Hotel" : "Save Hotel"}
          </Button>
        </div>
      </div>
    </div>
  )
}