export interface Payment {
  id: string
  date: string
  amount: number
  method: string
  reference: string
  status: 'completed' | 'pending' | 'failed'
  notes?: string
}

export interface InstallmentPayer {
  id: string
  name: string
  totalAmount: number
  paidAmount: number
  payments: {
    date: string
    amount: number
    method: string
    reference?: string
  }[]
}

export interface InstallmentPlan {
  id: string
  totalAmount: number
  payers: InstallmentPayer[]
  startDate: string
  notes?: string
}

export interface CancellationPolicy {
  id: string
  cancellationFee: number
  refundAmount: number
  deadline: string
  reason?: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
}