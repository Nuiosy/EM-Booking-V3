import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerBankAccount, CustomerCard } from "@/types/customer"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { CARD_TYPES } from "@/lib/constants/customerData"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PaymentMethodsTabProps {
  bankAccounts: CustomerBankAccount[]
  cards: CustomerCard[]
  onChange: (field: string, value: any) => void
}

export function PaymentMethodsTab({ bankAccounts, cards, onChange }: PaymentMethodsTabProps) {
  const [editingBankAccount, setEditingBankAccount] = useState<CustomerBankAccount | null>(null)
  const [editingCard, setEditingCard] = useState<CustomerCard | null>(null)
  const [newBankAccount, setNewBankAccount] = useState<Partial<CustomerBankAccount>>({
    accountHolder: '',
    bankName: '',
    iban: '',
    bic: '',
    country: ''
  })
  const [newCard, setNewCard] = useState<Partial<CustomerCard>>({
    owner: '',
    type: '',
    number: '',
    validUntil: '',
    comment: ''
  })

  const handleAddBankAccount = () => {
    if (!newBankAccount.accountHolder || !newBankAccount.iban) {
      alert("Please fill in all required fields")
      return
    }

    const bankAccount: CustomerBankAccount = {
      id: Math.random().toString(36).substr(2, 9),
      ...newBankAccount as Omit<CustomerBankAccount, 'id'>
    }

    onChange('bankAccounts', [...bankAccounts, bankAccount])
    setNewBankAccount({
      accountHolder: '',
      bankName: '',
      iban: '',
      bic: '',
      country: ''
    })
  }

  const handleAddCard = () => {
    if (!newCard.owner || !newCard.number || !newCard.validUntil) {
      alert("Please fill in all required fields")
      return
    }

    const card: CustomerCard = {
      id: Math.random().toString(36).substr(2, 9),
      ...newCard as Omit<CustomerCard, 'id'>
    }

    onChange('cards', [...cards, card])
    setNewCard({
      owner: '',
      type: '',
      number: '',
      validUntil: '',
      comment: ''
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="bank-accounts">
          <TabsList>
            <TabsTrigger value="bank-accounts">Bank Accounts</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>

          <TabsContent value="bank-accounts" className="space-y-6">
            {/* Bank Account List */}
            <div className="space-y-4">
              {bankAccounts.map((account) => (
                <div 
                  key={account.id}
                  className="flex items-start justify-between p-4 rounded-lg border"
                >
                  <div>
                    <div className="font-medium">{account.accountHolder}</div>
                    <div className="text-sm text-muted-foreground">
                      IBAN: {account.iban}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      BIC: {account.bic}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {account.bankName}, {account.country}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingBankAccount(account)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onChange('bankAccounts', bankAccounts.filter(a => a.id !== account.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add/Edit Bank Account Form */}
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-medium">
                {editingBankAccount ? 'Edit Bank Account' : 'Add New Bank Account'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Account Holder</Label>
                  <Input
                    value={editingBankAccount?.accountHolder || newBankAccount.accountHolder}
                    onChange={(e) => 
                      editingBankAccount 
                        ? setEditingBankAccount({ ...editingBankAccount, accountHolder: e.target.value })
                        : setNewBankAccount({ ...newBankAccount, accountHolder: e.target.value })
                    }
                    placeholder="Enter account holder name"
                  />
                </div>
                <div>
                  <Label>Bank Name</Label>
                  <Input
                    value={editingBankAccount?.bankName || newBankAccount.bankName}
                    onChange={(e) => 
                      editingBankAccount 
                        ? setEditingBankAccount({ ...editingBankAccount, bankName: e.target.value })
                        : setNewBankAccount({ ...newBankAccount, bankName: e.target.value })
                    }
                    placeholder="Enter bank name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>IBAN</Label>
                  <Input
                    value={editingBankAccount?.iban || newBankAccount.iban}
                    onChange={(e) => 
                      editingBankAccount 
                        ? setEditingBankAccount({ ...editingBankAccount, iban: e.target.value })
                        : setNewBankAccount({ ...newBankAccount, iban: e.target.value })
                    }
                    placeholder="Enter IBAN"
                  />
                </div>
                <div>
                  <Label>BIC</Label>
                  <Input
                    value={editingBankAccount?.bic || newBankAccount.bic}
                    onChange={(e) => 
                      editingBankAccount 
                        ? setEditingBankAccount({ ...editingBankAccount, bic: e.target.value })
                        : setNewBankAccount({ ...newBankAccount, bic: e.target.value })
                    }
                    placeholder="Enter BIC"
                  />
                </div>
              </div>

              <div>
                <Label>Country</Label>
                <Input
                  value={editingBankAccount?.country || newBankAccount.country}
                  onChange={(e) => 
                    editingBankAccount 
                      ? setEditingBankAccount({ ...editingBankAccount, country: e.target.value })
                      : setNewBankAccount({ ...newBankAccount, country: e.target.value })
                  }
                  placeholder="Enter country"
                />
              </div>

              <div className="flex justify-end space-x-2">
                {editingBankAccount ? (
                  <>
                    <Button variant="outline" onClick={() => setEditingBankAccount(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      onChange('bankAccounts', bankAccounts.map(a => 
                        a.id === editingBankAccount.id ? editingBankAccount : a
                      ))
                      setEditingBankAccount(null)
                    }}>
                      Update Bank Account
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleAddBankAccount}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bank Account
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cards" className="space-y-6">
            {/* Cards List */}
            <div className="space-y-4">
              {cards.map((card) => (
                <div 
                  key={card.id}
                  className="flex items-start justify-between p-4 rounded-lg border"
                >
                  <div>
                    <div className="font-medium">{card.owner}</div>
                    <div className="text-sm text-muted-foreground">
                      {card.type} - **** {card.number.slice(-4)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Valid until: {card.validUntil}
                    </div>
                    {card.comment && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {card.comment}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCard(card)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onChange('cards', cards.filter(c => c.id !== card.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add/Edit Card Form */}
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="font-medium">
                {editingCard ? 'Edit Card' : 'Add New Card'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Card Owner</Label>
                  <Input
                    value={editingCard?.owner || newCard.owner}
                    onChange={(e) => 
                      editingCard 
                        ? setEditingCard({ ...editingCard, owner: e.target.value })
                        : setNewCard({ ...newCard, owner: e.target.value })
                    }
                    placeholder="Enter card owner name"
                  />
                </div>
                <div>
                  <Label>Card Type</Label>
                  <Select
                    value={editingCard?.type || newCard.type}
                    onValueChange={(value) => 
                      editingCard 
                        ? setEditingCard({ ...editingCard, type: value })
                        : setNewCard({ ...newCard, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CARD_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Card Number</Label>
                  <Input
                    value={editingCard?.number || newCard.number}
                    onChange={(e) => 
                      editingCard 
                        ? setEditingCard({ ...editingCard, number: e.target.value })
                        : setNewCard({ ...newCard, number: e.target.value })
                    }
                    placeholder="Enter card number"
                  />
                </div>
                <div>
                  <Label>Valid Until</Label>
                  <Input
                    type="month"
                    value={editingCard?.validUntil || newCard.validUntil}
                    onChange={(e) => 
                      editingCard 
                        ? setEditingCard({ ...editingCard, validUntil: e.target.value })
                        : setNewCard({ ...newCard, validUntil: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Comment</Label>
                <Input
                  value={editingCard?.comment || newCard.comment}
                  onChange={(e) => 
                    editingCard 
                      ? setEditingCard({ ...editingCard, comment: e.target.value })
                      : setNewCard({ ...newCard, comment: e.target.value })
                  }
                  placeholder="Add any additional notes"
                />
              </div>

              <div className="flex justify-end space-x-2">
                {editingCard ? (
                  <>
                    <Button variant="outline" onClick={() => setEditingCard(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      onChange('cards', cards.map(c => 
                        c.id === editingCard.id ? editingCard : c
                      ))
                      setEditingCard(null)
                    }}>
                      Update Card
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleAddCard}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Card
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}