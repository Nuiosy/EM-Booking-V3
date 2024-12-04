import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"

interface PurchaseEntry {
  id: string
  type: string
  relatedItemId: string
  description: string
  purchasePrice: number
  supplier: string
  purchaseDate: string
  paymentDue: string
  commission?: number
  notes?: string
}

interface ControllingTabProps {
  bookingId: string
  flights: any[]
  hotels: any[]
  onSave: (entry: PurchaseEntry) => void
}

export function ControllingTab({ bookingId, flights, hotels, onSave }: ControllingTabProps) {
  const [selectedType, setSelectedType] = useState("")
  const [selectedItem, setSelectedItem] = useState("")
  const [formData, setFormData] = useState<Partial<PurchaseEntry>>({
    purchaseDate: format(new Date(), 'yyyy-MM-dd'),
    paymentDue: format(new Date(), 'yyyy-MM-dd')
  })

  const handleSubmit = () => {
    if (!formData.purchasePrice || !selectedType || !selectedItem) {
      alert("Please fill in all required fields")
      return
    }

    onSave({
      id: Math.random().toString(36).substr(2, 9),
      type: selectedType,
      relatedItemId: selectedItem,
      ...formData as Omit<PurchaseEntry, 'id' | 'type' | 'relatedItemId'>
    })

    // Reset form
    setSelectedType("")
    setSelectedItem("")
    setFormData({
      purchaseDate: format(new Date(), 'yyyy-MM-dd'),
      paymentDue: format(new Date(), 'yyyy-MM-dd')
    })
  }

  const getRelatedItems = () => {
    switch (selectedType) {
      case "flight":
        return flights.map(flight => ({
          id: flight.id,
          label: `${flight.from.code} → ${flight.to.code} (${flight.flightNumber})`
        }))
      case "hotel":
        return hotels.map(hotel => ({
          id: hotel.id,
          label: `${hotel.name} (${format(new Date(hotel.checkIn), 'MMM d')} - ${format(new Date(hotel.checkOut), 'MMM d')})`
        }))
      default:
        return []
    }
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Type</Label>
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Related Item</Label>
            <Select
              value={selectedItem}
              onValueChange={setSelectedItem}
              disabled={!selectedType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                {getRelatedItems().map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Purchase Price</Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.purchasePrice || ""}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  purchasePrice: parseFloat(e.target.value)
                }))}
                className="pl-6"
              />
              <span className="absolute left-2 top-2.5">€</span>
            </div>
          </div>
          <div>
            <Label>Commission (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.commission || ""}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                commission: parseFloat(e.target.value)
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Supplier</Label>
            <Input
              value={formData.supplier || ""}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                supplier: e.target.value
              }))}
              placeholder="Enter supplier name"
            />
          </div>
          <div>
            <Label>Purchase Date</Label>
            <Input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                purchaseDate: e.target.value
              }))}
            />
          </div>
          <div>
            <Label>Payment Due</Label>
            <Input
              type="date"
              value={formData.paymentDue}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                paymentDue: e.target.value
              }))}
            />
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={formData.description || ""}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              description: e.target.value
            }))}
            placeholder="Enter description"
          />
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea
            value={formData.notes || ""}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              notes: e.target.value
            }))}
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit}>
            Save Purchase Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}