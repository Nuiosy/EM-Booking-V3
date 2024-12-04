import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface OptionsTabProps {
  options: {
    isInvisible: boolean
    isBlocked: boolean
    isDunningBlocked: boolean
    cashPaymentOnly: boolean
    isDeceased: boolean
  }
  onChange: (field: string, value: boolean) => void
}

export function OptionsTab({ options, onChange }: OptionsTabProps) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Customer Invisible</Label>
              <p className="text-sm text-muted-foreground">
                Hide this customer from general views and reports
              </p>
            </div>
            <Switch
              checked={options.isInvisible}
              onCheckedChange={(checked) => onChange('isInvisible', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Customer Block</Label>
              <p className="text-sm text-muted-foreground">
                Prevent any new bookings or transactions
              </p>
            </div>
            <Switch
              checked={options.isBlocked}
              onCheckedChange={(checked) => onChange('isBlocked', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dunning Block</Label>
              <p className="text-sm text-muted-foreground">
                Prevent dunning processes for this customer
              </p>
            </div>
            <Switch
              checked={options.isDunningBlocked}
              onCheckedChange={(checked) => onChange('isDunningBlocked', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cash Payment Only</Label>
              <p className="text-sm text-muted-foreground">
                Restrict payment methods to cash only
              </p>
            </div>
            <Switch
              checked={options.cashPaymentOnly}
              onCheckedChange={(checked) => onChange('cashPaymentOnly', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Customer Deceased</Label>
              <p className="text-sm text-muted-foreground">
                Mark customer as deceased and restrict account activity
              </p>
            </div>
            <Switch
              checked={options.isDeceased}
              onCheckedChange={(checked) => onChange('isDeceased', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}