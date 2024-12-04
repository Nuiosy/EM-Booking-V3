import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, TrendingDown, Percent } from "lucide-react"

interface BookingFinancialsProps {
  totalSales: number
  totalPurchase: number
  totalPaid: number
  totalOutstanding: number
}

export function BookingFinancials({ 
  totalSales = 0,
  totalPurchase = 0, 
  totalPaid = 0,
  totalOutstanding = 0
}: BookingFinancialsProps) {
  const profit = totalSales - totalPurchase
  const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0
  const paymentProgress = totalSales > 0 ? (totalPaid / totalSales) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Financial Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Sales</p>
                  <h3 className="text-2xl font-bold">€{totalSales.toFixed(2)}</h3>
                </div>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Purchase Cost</p>
                  <h3 className="text-2xl font-bold">€{totalPurchase.toFixed(2)}</h3>
                </div>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Profit/Loss</p>
                  <h3 className="text-2xl font-bold">€{profit.toFixed(2)}</h3>
                  <Badge 
                    variant={profit >= 0 ? "default" : "destructive"}
                    className="mt-1"
                  >
                    {profitMargin.toFixed(1)}% margin
                  </Badge>
                </div>
                {profit >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Payment Status</p>
                    <h3 className="text-2xl font-bold">€{totalPaid.toFixed(2)}</h3>
                    <p className="text-sm text-muted-foreground">
                      Outstanding: €{totalOutstanding.toFixed(2)}
                    </p>
                  </div>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </div>
                <Progress value={paymentProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}