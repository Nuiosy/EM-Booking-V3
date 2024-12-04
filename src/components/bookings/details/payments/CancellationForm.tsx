import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CancellationPolicy } from "@/types/payment"

interface CancellationFormProps {
  onSubmit: (data: Partial<CancellationPolicy>) => void
  totalAmount: number
  paidAmount: number
  initialData?: CancellationPolicy | null
}

export function CancellationForm({ onSubmit, totalAmount, paidAmount, initialData }: CancellationFormProps) {
  const [formData, setFormData] = useState<Partial<CancellationPolicy>>({
    cancellationFee: totalAmount * 0.1, // Default 10% cancellation fee
    refundAmount: paidAmount - (totalAmount * 0.1),
    deadline: new Date().toISOString().split('T')[0],
    reason: ""
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        deadline: new Date(initialData.deadline).toISOString().split('T')[0]
      })
    }
  }, [initialData])

  const handleInputChange = (field: keyof CancellationPolicy, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Recalculate refund amount when cancellation fee changes
      if (field === 'cancellationFee') {
        newData.refundAmount = paidAmount - value
      }
      
      return newData
    })
  }

  const handleSubmit = () => {
    if (!formData.cancellationFee || !formData.deadline) {
      alert("Please fill in all required fields")
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="space-y-6 rounded-lg border p-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Cancellation Fee</Label>
          <Input 
            type="number"
            min="0"
            step="0.01"
            value={formData.cancellationFee}
            onChange={(e) => handleInputChange('cancellationFee', parseFloat(e.target.value))}
          />
        </div>
        <div>
          <Label>Refund Amount</Label>
          <Input 
            type="number"
            value={formData.refundAmount}
            disabled
          />
        </div>
      </div>

      <div>
        <Label>Deadline</Label>
        <Input 
          type="date"
          value={formData.deadline}
          onChange={(e) => handleInputChange('deadline', e.target.value)}
        />
      </div>

      <div>
        <Label>Reason for Cancellation</Label>
        <Textarea 
          value={formData.reason}
          onChange={(e) => handleInputChange('reason', e.target.value)}
          placeholder="Please provide the reason for cancellation..."
          className="h-24"
        />
      </div>

      <div className="rounded-lg bg-muted p-4">
        <h4 className="font-medium mb-2">Summary</h4>
        <div className="space-y-1 text-sm">
          <p>Total Booking Amount: €{totalAmount.toFixed(2)}</p>
          <p>Amount Paid: €{paidAmount.toFixed(2)}</p>
          <p>Cancellation Fee: €{formData.cancellationFee?.toFixed(2)}</p>
          <p className="font-medium">Refund Amount: €{formData.refundAmount?.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button onClick={handleSubmit}>
          {initialData ? 'Update Cancellation Request' : 'Submit Cancellation Request'}
        </Button>
      </div>
    </div>
  )
}