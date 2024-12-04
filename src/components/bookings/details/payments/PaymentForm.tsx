import { useState, useEffect } from "react"
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
import { Payment, InstallmentPlan } from "@/types/payment"
import { format } from "date-fns"

interface PaymentFormProps {
  onSubmit: (data: Partial<Payment>) => void
  onCancel: () => void
  balance: number
  installmentPlan: InstallmentPlan | null
  initialData?: Payment | null
}

const paymentMethods = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "PayPal",
  "Check"
]

export function PaymentForm({ onSubmit, onCancel, balance, installmentPlan, initialData }: PaymentFormProps) {
  const [formData, setFormData] = useState<Partial<Payment>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: 0,
    method: "",
    reference: "",
    notes: ""
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: format(new Date(initialData.date), 'yyyy-MM-dd')
      })
    }
  }, [initialData])

  const handleInputChange = (field: keyof Payment, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.amount || !formData.method) {
      alert("Please fill in all required fields")
      return
    }
    onSubmit(formData)
  }

  // Get unpaid installments for the dropdown
  const unpaidInstallments = installmentPlan?.installments
    .map((inst, index) => !inst.paid ? { index, ...inst } : null)
    .filter(Boolean) || []

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Payment Date</Label>
          <Input 
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
          />
        </div>
        <div>
          <Label>Amount</Label>
          <Input 
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Payment Method</Label>
          <Select
            value={formData.method}
            onValueChange={(value) => handleInputChange('method', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Reference Number</Label>
          <Input 
            value={formData.reference}
            onChange={(e) => handleInputChange('reference', e.target.value)}
            placeholder="Enter reference number"
          />
        </div>
      </div>

      {unpaidInstallments.length > 0 && !initialData && (
        <div>
          <Label>Link to Installment (Optional)</Label>
          <Select
            value={formData.reference}
            onValueChange={(value) => {
              if (value) {
                const installment = installmentPlan?.installments[parseInt(value)]
                handleInputChange('reference', `INST-${installmentPlan?.id}-${parseInt(value) + 1}`)
                handleInputChange('amount', installment?.amount || 0)
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select installment" />
            </SelectTrigger>
            <SelectContent>
              {unpaidInstallments.map((inst: any) => (
                <SelectItem key={inst.index} value={inst.index.toString()}>
                  Installment {inst.index + 1} - €{inst.amount} (Due: {format(new Date(inst.dueDate), 'MMM d, yyyy')})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>Notes</Label>
        <Textarea 
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Add any additional notes..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? 'Update Payment' : 'Save Payment'}
        </Button>
      </div>
    </div>
  )
}