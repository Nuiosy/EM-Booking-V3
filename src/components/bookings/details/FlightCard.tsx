import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plane, ArrowRight, Clock, ChevronDown, ChevronUp, AlertCircle, Copy } from "lucide-react"
import { Flight } from "@/types/flight"
import { cn } from "@/lib/utils"
import { format, isAfter, subDays } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

interface FlightCardProps {
  flight: Flight
  onEdit: (flight: Flight) => void
  onDelete: (id: string) => void
}

export function FlightCard({ flight, onEdit, onDelete }: FlightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { toast } = useToast()
  const isOptionNearExpiry = flight.option && isAfter(new Date(), subDays(new Date(flight.option.expiryDate), 2))

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: `${label} Copied`,
      description: `${label} has been copied to clipboard.`
    })
  }

  return (
    <div className="rounded-lg border">
      {/* Flight Route Summary - Always Visible */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-12">
          {/* Departure */}
          <div className="text-center">
            <Plane className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{flight.from.code}</div>
            <div className="text-sm text-muted-foreground">{flight.from.name}</div>
            <div className="text-sm text-muted-foreground">
              {flight.from.city && flight.from.country 
                ? `${flight.from.city}, ${flight.from.country}`
                : 'Location not available'}
            </div>
            <div className="text-sm font-medium">{flight.from.time}</div>
          </div>

          {/* Flight Info */}
          <div className="flex flex-col items-center">
            <div className="text-sm text-muted-foreground">{flight.carrier || 'Carrier TBA'}</div>
            <div className="flex items-center space-x-2">
              <ArrowRight className="h-4 w-4" />
              <div className="text-sm font-medium">{flight.flightNumber || 'Flight # TBA'}</div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{flight.duration || 'Duration TBA'}</span>
            </div>
            {flight.option && (
              <Badge 
                variant={isOptionNearExpiry ? "destructive" : "secondary"}
                className="mt-2"
              >
                {isOptionNearExpiry && <AlertCircle className="h-3 w-3 mr-1" />}
                Option until {format(new Date(flight.option.expiryDate), 'MMM d, yyyy')}
              </Badge>
            )}
          </div>

          {/* Arrival */}
          <div className="text-center">
            <Plane className="h-8 w-8 mx-auto mb-2 transform rotate-90" />
            <div className="text-2xl font-bold">{flight.to.code}</div>
            <div className="text-sm text-muted-foreground">{flight.to.name}</div>
            <div className="text-sm text-muted-foreground">
              {flight.to.city && flight.to.country 
                ? `${flight.to.city}, ${flight.to.country}`
                : 'Location not available'}
            </div>
            <div className="text-sm font-medium">{flight.to.time}</div>
          </div>
        </div>

        {/* Expand/Collapse and Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(flight)}>
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-destructive"
            onClick={() => onDelete(flight.id)}
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
          "grid grid-cols-4 gap-4 px-6 overflow-hidden transition-all duration-200",
          isExpanded ? "py-6 border-t" : "h-0 py-0"
        )}
      >
        <div>
          <Label className="text-sm text-muted-foreground">Flight Date</Label>
          <div className="font-medium">{flight.date}</div>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Arrival Date</Label>
          <div className="font-medium">{flight.arrivalDate}</div>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Baggage</Label>
          <div className="font-medium">{flight.baggage} kg</div>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Organizer</Label>
          <div className="font-medium">{flight.organizer}</div>
        </div>

        {/* PNR and Price Information */}
        <div>
          <Label className="text-sm text-muted-foreground">PNR Number</Label>
          <div className="flex items-center space-x-2">
            <div className="font-medium">{flight.pnr || "ABC123"}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => copyToClipboard(flight.pnr || "ABC123", "PNR")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Price</Label>
          <div className="font-medium">€{flight.price?.toFixed(2) || "299.99"}</div>
        </div>

        {flight.option && (
          <>
            <div>
              <Label className="text-sm text-muted-foreground">Option Date</Label>
              <div className="font-medium">
                {format(new Date(flight.option.date), 'MMM d, yyyy')}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Option Price</Label>
              <div className="font-medium">€{flight.option.price.toFixed(2)}</div>
            </div>
          </>
        )}

        <div>
          <Label className="text-sm text-muted-foreground">Travel Status</Label>
          <div className="font-medium">{flight.travelStatus}</div>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Processing Status</Label>
          <div className="font-medium">{flight.processingStatus}</div>
        </div>
        <div className="col-span-2">
          <Label className="text-sm text-muted-foreground">Travel Reason</Label>
          <div className="font-medium">{flight.travelReason}</div>
        </div>
        <div className="col-span-4">
          <Label className="text-sm text-muted-foreground">Comments</Label>
          <div className="font-medium">{flight.comments}</div>
        </div>
      </div>
    </div>
  )
}