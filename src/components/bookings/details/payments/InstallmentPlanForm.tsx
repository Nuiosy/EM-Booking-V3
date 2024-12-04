import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, MoreVertical } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { InstallmentPlan, InstallmentPayer } from "@/types/payment"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface InstallmentPlanFormProps {
  onSubmit: (data: Partial<InstallmentPlan>) => void
  totalAmount: number
  paidAmount: number
  initialData?: InstallmentPlan
}

const paymentMethods = ["Cash", "Credit Card", "Bank Transfer", "PayPal"]

export function InstallmentPlanForm({ onSubmit, totalAmount, paidAmount, initialData }: InstallmentPlanFormProps) {
  const { toast } = useToast()
  const [isAddPayerOpen, setIsAddPayerOpen] = useState(false)
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  const [editingPayer, setEditingPayer] = useState<string | null>(null)
  const [editingPayment, setEditingPayment] = useState<{ payerId: string, paymentIndex: number } | null>(null)
  
  const [formData, setFormData] = useState<Partial<InstallmentPlan>>(initialData || {
    totalAmount: 0,
    payers: [],
    startDate: format(new Date(), 'yyyy-MM-dd')
  })

  const [newPayer, setNewPayer] = useState({
    name: "",
    totalAmount: 0
  })

  const [newPayment, setNewPayment] = useState({
    payerId: "",
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: 0,
    method: ""
  })

  const handleEditPayer = (payerId: string) => {
    const payer = formData.payers?.find(p => p.id === payerId)
    if (payer) {
      setNewPayer({
        name: payer.name,
        totalAmount: payer.totalAmount
      })
      setEditingPayer(payerId)
      setIsAddPayerOpen(true)
    }
  }

  const handleDeletePayer = (payerId: string) => {
    if (window.confirm("Are you sure you want to delete this payer?")) {
      setFormData(prev => ({
        ...prev,
        payers: prev.payers?.filter(p => p.id !== payerId) || []
      }))
      toast({
        title: "Payer Deleted",
        description: "The payer has been removed from the installment plan."
      })
    }
  }

  const handleEditPayment = (payerId: string, paymentIndex: number) => {
    const payer = formData.payers?.find(p => p.id === payerId)
    const payment = payer?.payments[paymentIndex]
    if (payment) {
      setNewPayment({
        payerId,
        date: payment.date,
        amount: payment.amount,
        method: payment.method
      })
      setEditingPayment({ payerId, paymentIndex })
      setIsAddPaymentOpen(true)
    }
  }

  const handleDeletePayment = (payerId: string, paymentIndex: number) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      setFormData(prev => ({
        ...prev,
        payers: prev.payers?.map(payer => {
          if (payer.id === payerId) {
            const deletedPayment = payer.payments[paymentIndex]
            return {
              ...payer,
              paidAmount: payer.paidAmount - deletedPayment.amount,
              payments: payer.payments.filter((_, index) => index !== paymentIndex)
            }
          }
          return payer
        }) || []
      }))
      toast({
        title: "Payment Deleted",
        description: "The payment has been removed from the installment plan."
      })
    }
  }

  const addOrUpdatePayer = () => {
    if (!newPayer.name || !newPayer.totalAmount) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter payer name and amount"
      })
      return
    }

    setFormData(prev => ({
      ...prev,
      payers: editingPayer
        ? prev.payers?.map(p => 
            p.id === editingPayer 
              ? { ...p, name: newPayer.name, totalAmount: newPayer.totalAmount }
              : p
          ) || []
        : [...(prev.payers || []), {
            id: Math.random().toString(36).substr(2, 9),
            name: newPayer.name,
            totalAmount: newPayer.totalAmount,
            paidAmount: 0,
            payments: []
          }]
    }))

    setNewPayer({ name: "", totalAmount: 0 })
    setEditingPayer(null)
    setIsAddPayerOpen(false)
    
    toast({
      title: editingPayer ? "Payer Updated" : "Payer Added",
      description: `${newPayer.name} has been ${editingPayer ? 'updated' : 'added'} successfully.`
    })
  }

  const addOrUpdatePayment = () => {
    const { payerId, amount, date, method } = newPayment
    if (!amount) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a payment amount"
      })
      return
    }

    setFormData(prev => ({
      ...prev,
      payers: prev.payers?.map(payer => {
        if (payer.id === payerId) {
          if (editingPayment) {
            // Update existing payment
            const oldAmount = payer.payments[editingPayment.paymentIndex].amount
            const newPayments = [...payer.payments]
            newPayments[editingPayment.paymentIndex] = { date, amount, method }
            return {
              ...payer,
              paidAmount: payer.paidAmount - oldAmount + amount,
              payments: newPayments
            }
          } else {
            // Add new payment
            return {
              ...payer,
              paidAmount: payer.paidAmount + amount,
              payments: [...payer.payments, { date, amount, method }]
            }
          }
        }
        return payer
      }) || []
    }))

    setNewPayment({
      payerId: "",
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: 0,
      method: ""
    })
    setEditingPayment(null)
    setIsAddPaymentOpen(false)

    toast({
      title: editingPayment ? "Payment Updated" : "Payment Added",
      description: `Payment of €${amount.toFixed(2)} has been ${editingPayment ? 'updated' : 'recorded'} successfully.`
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Create Installment Plan</h3>
          <p className="text-sm text-muted-foreground">
            Total Amount: €{totalAmount.toFixed(2)} | Remaining: €{(totalAmount - paidAmount).toFixed(2)}
          </p>
        </div>
        <Button onClick={() => setIsAddPayerOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Payer
        </Button>
      </div>

      {/* Payers List */}
      <div className="space-y-4">
        {formData.payers?.map((payer) => (
          <div key={payer.id} className="rounded-lg border p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h5 className="font-medium">{payer.name}</h5>
                <p className="text-sm text-muted-foreground">
                  Total: €{payer.totalAmount.toFixed(2)} | Paid: €{payer.paidAmount.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewPayment(prev => ({ ...prev, payerId: payer.id }))
                    setIsAddPaymentOpen(true)
                  }}
                >
                  Add Payment
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditPayer(payer.id)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Payer
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDeletePayer(payer.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Payer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {payer.payments.length > 0 && (
              <div className="space-y-2">
                <h6 className="text-sm font-medium">Payment History</h6>
                {payer.payments.map((payment, index) => (
                  <div key={index} className="text-sm flex justify-between items-center">
                    <span>{format(new Date(payment.date), 'MMM d, yyyy')}</span>
                    <span>{payment.method}</span>
                    <span>€{payment.amount.toFixed(2)}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditPayment(payer.id, index)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeletePayment(payer.id, index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Payment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Payer Dialog */}
      <Dialog open={isAddPayerOpen} onOpenChange={setIsAddPayerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPayer ? "Edit Payer" : "Add New Payer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={newPayer.name}
                onChange={(e) => setNewPayer(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter payer name"
              />
            </div>
            <div>
              <Label>Total Amount</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newPayer.totalAmount}
                onChange={(e) => setNewPayer(prev => ({ ...prev, totalAmount: parseFloat(e.target.value) }))}
                placeholder="Enter amount"
              />
            </div>
            <Button onClick={addOrUpdatePayer} className="w-full">
              {editingPayer ? "Update Payer" : "Add Payer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Payment Dialog */}
      <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPayment ? "Edit Payment" : "Add New Payment"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={newPayment.date}
                onChange={(e) => setNewPayment(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newPayment.amount}
                onChange={(e) => setNewPayment(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select
                value={newPayment.method}
                onValueChange={(value) => setNewPayment(prev => ({ ...prev, method: value }))}
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
            <Button onClick={addOrUpdatePayment} className="w-full">
              {editingPayment ? "Update Payment" : "Add Payment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}