import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Participant } from "@/types/participant"

interface ParticipantFormProps {
  onSubmit: (data: Partial<Participant>) => void
  onCancel: () => void
  initialData?: Participant
}

const salutations = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."]

export function ParticipantForm({ onSubmit, onCancel, initialData }: ParticipantFormProps) {
  const [formData, setFormData] = useState<Partial<Participant>>({
    salutation: initialData?.salutation || "",
    lastName: initialData?.lastName || "",
    firstName: initialData?.firstName || "",
    dateOfBirth: initialData?.dateOfBirth || "",
    ticketNumber: initialData?.ticketNumber || "",
    passportNumber: initialData?.passportNumber || "",
    passportExpiry: initialData?.passportExpiry || "",
    comments: initialData?.comments || ""
  })

  const handleInputChange = (field: keyof Participant, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.salutation || !formData.lastName || !formData.firstName) {
      alert("Please fill in all required fields (Salutation, Last Name, First Name)")
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-lg font-medium mb-4">
        {initialData ? "Edit Participant" : "Add New Participant"}
      </h3>
      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Salutation *</Label>
            <Select 
              value={formData.salutation}
              onValueChange={(value) => handleInputChange('salutation', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select salutation" />
              </SelectTrigger>
              <SelectContent>
                {salutations.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>First Name *</Label>
            <Input 
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div>
            <Label>Last Name *</Label>
            <Input 
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Date of Birth</Label>
            <Input 
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            />
          </div>
          <div>
            <Label>Ticket Number</Label>
            <Input 
              value={formData.ticketNumber}
              onChange={(e) => handleInputChange('ticketNumber', e.target.value)}
              placeholder="Enter ticket number"
            />
          </div>
        </div>

        {/* Passport Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Passport Number</Label>
            <Input 
              value={formData.passportNumber}
              onChange={(e) => handleInputChange('passportNumber', e.target.value)}
              placeholder="Enter passport number"
            />
          </div>
          <div>
            <Label>Passport Expiry Date</Label>
            <Input 
              type="date"
              value={formData.passportExpiry}
              onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
            />
          </div>
        </div>

        {/* Comments */}
        <div>
          <Label>Comments</Label>
          <Textarea 
            value={formData.comments}
            onChange={(e) => handleInputChange('comments', e.target.value)}
            placeholder="Add any additional notes..."
            className="h-24"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? "Update Participant" : "Save Participant"}
          </Button>
        </div>
      </div>
    </div>
  )
}