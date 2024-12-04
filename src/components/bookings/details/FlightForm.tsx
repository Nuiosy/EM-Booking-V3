import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AirportSelector } from "@/components/ui/airport-selector"
import { TimePicker } from "@/components/ui/time-picker"
import { Flight } from "@/types/flight"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  CARRIERS, 
  ORGANIZERS, 
  TRAVEL_STATUSES, 
  PROCESSING_STATUSES,
  calculateFlightDuration,
  formatDate,
  parseUserDate,
  parseUserTime
} from "@/lib/constants/flightData"

interface FlightFormProps {
  onSubmit: (data: Partial<Flight>) => void
  onCancel: () => void
  initialData?: Flight
}

export function FlightForm({ onSubmit, onCancel, initialData }: FlightFormProps) {
  const [formData, setFormData] = useState<Partial<Flight>>({
    date: new Date().toISOString().split('T')[0],
    from: { code: "", name: "", time: "" },
    to: { code: "", name: "", time: "" },
    carrier: "",
    flightNumber: "",
    duration: "",
    baggage: "",
    arrivalDate: new Date().toISOString().split('T')[0],
    organizer: "",
    travelReason: "",
    travelStatus: "New",
    processingStatus: "New",
    comments: "",
    option: undefined,
    pnr: "",
    price: 0
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasOption, setHasOption] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      setHasOption(!!initialData.option)
    }
  }, [initialData])

  // Calculate duration whenever times change
  useEffect(() => {
    if (formData.from?.time && formData.to?.time && formData.date && formData.arrivalDate) {
      const duration = calculateFlightDuration(
        formData.from.time,
        formData.to.time,
        formData.date,
        formData.arrivalDate
      )
      setFormData(prev => ({ ...prev, duration }))
    }
  }, [formData.from?.time, formData.to?.time, formData.date, formData.arrivalDate])

  const handleInputChange = (field: keyof Flight, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) newErrors.date = "Required"
    if (!formData.from?.code) newErrors['from.code'] = "Required"
    if (!formData.from?.time) newErrors['from.time'] = "Required"
    if (!formData.to?.code) newErrors['to.code'] = "Required"
    if (!formData.to?.time) newErrors['to.time'] = "Required"
    if (!formData.carrier) newErrors.carrier = "Required"
    if (!formData.flightNumber) newErrors.flightNumber = "Required"
    if (!formData.arrivalDate) newErrors.arrivalDate = "Required"
    if (!formData.organizer) newErrors.organizer = "Required"
    
    // PNR validation
    if (formData.pnr) {
      const pnrRegex = /^[A-Z0-9]{6}$/
      if (!pnrRegex.test(formData.pnr)) {
        newErrors.pnr = "PNR must be 6 characters (letters and numbers)"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit(formData)
  }

  return (
    <div className="rounded-lg border p-6 space-y-6">
      <h3 className="text-lg font-medium">
        {initialData ? "Edit Flight" : "Add New Flight"}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Flight Date</Label>
          <Input 
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
        </div>
        <div>
          <Label>Arrival Date</Label>
          <Input 
            type="date"
            value={formData.arrivalDate}
            onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
            className={errors.arrivalDate ? "border-red-500" : ""}
          />
          {errors.arrivalDate && <p className="text-sm text-red-500 mt-1">{errors.arrivalDate}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <Label>Departure</Label>
          <div className="space-y-2">
            <AirportSelector
              value={formData.from?.code}
              onChange={(code, airport) => handleInputChange('from', {
                ...formData.from,
                code,
                name: `${airport.city}, ${airport.country}`
              })}
              error={errors['from.code']}
              direction="departure"
            />
            <TimePicker
              date={formData.from?.time ? new Date(`1970-01-01T${formData.from.time}`) : undefined}
              setDate={(date) => handleInputChange('from', {
                ...formData.from,
                time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
              })}
              error={errors['from.time']}
            />
          </div>
        </div>
        <div className="space-y-4">
          <Label>Arrival</Label>
          <div className="space-y-2">
            <AirportSelector
              value={formData.to?.code}
              onChange={(code, airport) => handleInputChange('to', {
                ...formData.to,
                code,
                name: `${airport.city}, ${airport.country}`
              })}
              error={errors['to.code']}
              direction="arrival"
            />
            <TimePicker
              date={formData.to?.time ? new Date(`1970-01-01T${formData.to.time}`) : undefined}
              setDate={(date) => handleInputChange('to', {
                ...formData.to,
                time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
              })}
              error={errors['to.time']}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Carrier</Label>
          <Select
            value={formData.carrier}
            onValueChange={(value) => handleInputChange('carrier', value)}
          >
            <SelectTrigger className={errors.carrier ? "border-red-500" : ""}>
              <SelectValue placeholder="Select carrier" />
            </SelectTrigger>
            <SelectContent>
              {CARRIERS.map((carrier) => (
                <SelectItem key={carrier} value={carrier}>
                  {carrier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.carrier && <p className="text-sm text-red-500 mt-1">{errors.carrier}</p>}
        </div>
        <div>
          <Label>Flight Number</Label>
          <Input 
            value={formData.flightNumber}
            onChange={(e) => handleInputChange('flightNumber', e.target.value)}
            placeholder="e.g., LH1234"
            className={errors.flightNumber ? "border-red-500" : ""}
          />
          {errors.flightNumber && <p className="text-sm text-red-500 mt-1">{errors.flightNumber}</p>}
        </div>
        <div>
          <Label>PNR</Label>
          <Input 
            value={formData.pnr}
            onChange={(e) => handleInputChange('pnr', e.target.value.toUpperCase())}
            placeholder="e.g. ABC123"
            className={errors.pnr ? "border-red-500" : ""}
            maxLength={6}
            style={{ textTransform: 'uppercase' }}
          />
          {errors.pnr && <p className="text-sm text-red-500 mt-1">{errors.pnr}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Organizer</Label>
          <Select
            value={formData.organizer}
            onValueChange={(value) => handleInputChange('organizer', value)}
          >
            <SelectTrigger className={errors.organizer ? "border-red-500" : ""}>
              <SelectValue placeholder="Select organizer" />
            </SelectTrigger>
            <SelectContent>
              {ORGANIZERS.map((organizer) => (
                <SelectItem key={organizer} value={organizer}>
                  {organizer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.organizer && <p className="text-sm text-red-500 mt-1">{errors.organizer}</p>}
        </div>
        <div>
          <Label>Price</Label>
          <div className="relative">
            <Input 
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
              className="pl-6"
            />
            <span className="absolute left-2 top-2.5">€</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Travel Status</Label>
          <Select
            value={formData.travelStatus}
            onValueChange={(value) => handleInputChange('travelStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {TRAVEL_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Processing Status</Label>
          <Select
            value={formData.processingStatus}
            onValueChange={(value) => handleInputChange('processingStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {PROCESSING_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            checked={hasOption}
            onCheckedChange={(checked) => {
              setHasOption(checked);
              if (checked) {
                // Initialize option with default values when enabled
                setFormData(prev => ({
                  ...prev,
                  option: {
                    date: new Date().toISOString().split('T')[0],
                    price: 0,
                    expiryDate: new Date().toISOString().split('T')[0]
                  }
                }));
              } else {
                // Clear option when disabled
                setFormData(prev => ({ ...prev, option: undefined }));
              }
            }}
          />
          <Label>Flight Option</Label>
        </div>

        {hasOption && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Option Date</Label>
              <Input 
                type="date"
                value={formData.option?.date}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  option: {
                    ...prev.option,
                    date: e.target.value,
                    price: prev.option?.price || 0,
                    expiryDate: prev.option?.expiryDate || e.target.value
                  }
                }))}
              />
            </div>
            <div>
              <Label>Option Price</Label>
              <div className="relative">
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.option?.price}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    option: {
                      ...prev.option!,
                      price: parseFloat(e.target.value)
                    }
                  }))}
                  className="pl-6"
                />
                <span className="absolute left-2 top-2.5">€</span>
              </div>
            </div>
            <div>
              <Label>Option Expiry Date</Label>
              <Input 
                type="date"
                value={formData.option?.expiryDate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  option: {
                    ...prev.option!,
                    expiryDate: e.target.value
                  }
                }))}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <Label>Comments</Label>
        <Textarea 
          value={formData.comments}
          onChange={(e) => handleInputChange('comments', e.target.value)}
          placeholder="Add any notes or special requirements..."
          className="h-24"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? "Update Flight" : "Save Flight"}
        </Button>
      </div>
    </div>
  )
}