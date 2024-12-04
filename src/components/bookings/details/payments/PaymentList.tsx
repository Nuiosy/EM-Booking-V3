import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Payment } from "@/types/payment"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PaymentListProps {
  payments: Payment[]
  onEdit: (payment: Payment) => void
  onDelete: (id: string) => void
}

export function PaymentList({ payments, onEdit, onDelete }: PaymentListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              {format(new Date(payment.date), 'MMM d, yyyy')}
            </TableCell>
            <TableCell className="font-medium">
              €{payment.amount.toFixed(2)}
            </TableCell>
            <TableCell>{payment.method}</TableCell>
            <TableCell>{payment.reference}</TableCell>
            <TableCell>
              <Badge variant={
                payment.status === 'completed' ? 'default' :
                payment.status === 'pending' ? 'secondary' : 'destructive'
              }>
                {payment.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {payment.notes}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(payment)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Payment
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this payment?')) {
                        onDelete(payment.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Payment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}