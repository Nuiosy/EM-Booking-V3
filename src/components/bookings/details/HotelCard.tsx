import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Hotel } from "@/types/hotel"
import { Building2, Calendar, Users, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface HotelCardProps {
  hotel: Hotel
  onEdit: (hotel: Hotel) => void
  onDelete: (id: string) => void
}

export function HotelCard({ hotel, onEdit, onDelete }: HotelCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const totalGuests = 
    hotel.guests.adults + 
    hotel.guests.children + 
    hotel.guests.babies

  return (
    <div className="rounded-lg border">
      {/* Hotel Summary - Always Visible */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div>
            <Building2 className="h-8 w-8 mb-2" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{hotel.name}</h3>
            <p className="text-sm text-muted-foreground">{hotel.location}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <Calendar className="h-4 w-4 mb-1" />
              <span className="text-sm">
                {new Date(hotel.checkIn).toLocaleDateString()} - {new Date(hotel.checkOut).toLocaleDateString()}
              </span>
            </div>
            <div>
              <Users className="h-4 w-4 mb-1" />
              <span className="text-sm">{totalGuests} guests</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(hotel)}>
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-destructive"
            onClick={() => onDelete(hotel.id)}
          >
            Delete
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expandable Details Section */}
      <div
        className={cn(
          "grid grid-cols-3 gap-6 px-6 overflow-hidden transition-all duration-200",
          isExpanded ? "py-6 border-t" : "h-0 py-0"
        )}
      >
        <div>
          <Label className="text-sm text-muted-foreground">Accommodation</Label>
          <div className="font-medium">{hotel.accommodation}</div>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Meal Plan</Label>
          <div className="font-medium">{hotel.mealPlan}</div>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Organizer</Label>
          <div className="font-medium">{hotel.organizer}</div>
        </div>
        
        <div>
          <Label className="text-sm text-muted-foreground">Guests</Label>
          <div className="space-y-1">
            <div className="text-sm">Adults: {hotel.guests.adults}</div>
            <div className="text-sm">Children: {hotel.guests.children}</div>
            <div className="text-sm">Babies: {hotel.guests.babies}</div>
          </div>
        </div>
        
        <div>
          <Label className="text-sm text-muted-foreground">Pricing</Label>
          <div className="space-y-1">
            <div className="text-sm">Net: ${hotel.pricing.netPrice}</div>
            <div className="text-sm">Gross: ${hotel.pricing.grossPrice}</div>
          </div>
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Assigned Guests</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {hotel.assignedGuests.map((guest) => (
              <Badge 
                key={guest.id}
                variant={
                  guest.type === 'adult' ? 'default' :
                  guest.type === 'child' ? 'secondary' : 'outline'
                }
              >
                {guest.firstName} {guest.lastName}
                {guest.age ? ` (${guest.age})` : ''}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}