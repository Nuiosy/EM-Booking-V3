import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Payment, InstallmentPlan, CancellationPolicy } from "@/types/payment"
import { PaymentList } from "./payments/PaymentList"
import { PaymentForm } from "./payments/PaymentForm"
import { InstallmentPlanForm } from "./payments/InstallmentPlanForm"
import { CancellationForm } from "./payments/CancellationForm"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Calendar, DollarSign, Clock, Pencil, Trash2, MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function PaymentDetails() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [installmentPlan, setInstallmentPlan] = useState<InstallmentPlan | null>(null)
  const [cancellation, setCancellation] = useState<CancellationPolicy | null>(null)
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const { toast } = useToast()

  const totalAmount = 0
  const paidAmount = payments.reduce((sum, payment) => 
    payment.status === 'completed' ? sum + payment.amount : sum, 0
  )
  const balance = totalAmount - paidAmount

  const handleAddPayment = (data: Partial<Payment>) => {
    const newPayment = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'completed'
    } as Payment

    setPayments([...payments, newPayment])
    setIsAddingPayment(false)
    setEditingPayment(null)
    
    toast({
      title: "Payment Added",
      description: `Payment of €${data.amount} has been recorded successfully.`
    })
  }

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment)
    setIsAddingPayment(true)
  }

  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter(p => p.id !== id))
    toast({
      title: "Payment Deleted",
      description: "The payment has been deleted successfully.",
      variant: "destructive"
    })
  }

  const handleCreateInstallmentPlan = (data: Partial<InstallmentPlan>) => {
    const newPlan = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    } as InstallmentPlan

    setInstallmentPlan(newPlan)
    toast({
      title: "Installment Plan Created",
      description: `Payment plan has been created successfully.`
    })
  }

  const handleCancellation = (data: Partial<CancellationPolicy>) => {
    const newCancellation = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending'
    } as CancellationPolicy

    setCancellation(newCancellation)
    toast({
      title: "Cancellation Request Created",
      description: "The cancellation request has been submitted for review."
    })
  }

  const handleEditCancellation = () => {
    if (cancellation) {
      setCancellation(null) // This will show the form again with current data
    }
  }

  const handleDeleteCancellation = () => {
    if (window.confirm('Are you sure you want to delete this cancellation request?')) {
      setCancellation(null)
      toast({
        title: "Cancellation Deleted",
        description: "The cancellation request has been deleted.",
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Payment Management</CardTitle>
        <Button 
          size="sm" 
          onClick={() => {
            setIsAddingPayment(true)
            setEditingPayment(null)
          }}
          disabled={isAddingPayment}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Payment
        </Button>
      </CardHeader>
      <CardContent>
        {/* Payment Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">€{totalAmount.toFixed(2)}</p>
                </div>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
                  <p className="text-2xl font-bold">€{paidAmount.toFixed(2)}</p>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Balance</p>
                  <p className="text-2xl font-bold text-destructive">€{balance.toFixed(2)}</p>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="payments" className="w-full">
          <TabsList>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="installments">Installment Plan</TabsTrigger>
            <TabsTrigger value="cancellation">Cancellation</TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="mt-4">
            {isAddingPayment ? (
              <PaymentForm
                onSubmit={handleAddPayment}
                onCancel={() => {
                  setIsAddingPayment(false)
                  setEditingPayment(null)
                }}
                balance={balance}
                installmentPlan={installmentPlan}
                initialData={editingPayment}
              />
            ) : (
              <PaymentList 
                payments={payments}
                onEdit={handleEditPayment}
                onDelete={handleDeletePayment}
              />
            )}
          </TabsContent>

          <TabsContent value="installments" className="mt-4">
            <InstallmentPlanForm
              onSubmit={handleCreateInstallmentPlan}
              totalAmount={totalAmount}
              paidAmount={paidAmount}
              initialData={installmentPlan}
            />
          </TabsContent>

          <TabsContent value="cancellation" className="mt-4">
            {cancellation ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Cancellation Details</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          cancellation.status === 'approved' ? 'default' :
                          cancellation.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {cancellation.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEditCancellation}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit Cancellation
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={handleDeleteCancellation}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Cancellation
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Cancellation Fee</p>
                        <p className="font-medium">€{cancellation.cancellationFee.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Refund Amount</p>
                        <p className="font-medium">€{cancellation.refundAmount.toFixed(2)}</p>
                      </div>
                      {cancellation.reason && (
                        <div className="col-span-2">
                          <p className="text-sm text-muted-foreground">Reason</p>
                          <p className="font-medium">{cancellation.reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <CancellationForm
                onSubmit={handleCancellation}
                totalAmount={totalAmount}
                paidAmount={paidAmount}
                initialData={cancellation}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}