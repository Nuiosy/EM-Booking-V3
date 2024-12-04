import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CustomerAddress } from "@/types/customer"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { ADDRESS_TYPES } from "@/lib/constants/customerData"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddressesTabProps {
  addresses: CustomerAddress[]
  onChange: (addresses: CustomerAddress[]) => void
}

export function AddressesTab({ addresses, onChange }: AddressesTabProps) {
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null)
  const [newAddress, setNewAddress] = useState<Partial<CustomerAddress>>({
    type: '',
    street: '',
    number: '',
    postalCode: '',
    city: '',
    country: '',
    isMain: false,
    isBlocked: false,
    isOutdated: false
  })

  const handleAddAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.country) {
      alert("Please fill in all required fields")
      return
    }

    const address: CustomerAddress = {
      id: Math.random().toString(36).substr(2, 9),
      ...newAddress as Omit<CustomerAddress, 'id'>
    }

    onChange([...addresses, address])
    setNewAddress({
      type: '',
      street: '',
      number: '',
      postalCode: '',
      city: '',
      country: '',
      isMain: false,
      isBlocked: false,
      isOutdated: false
    })
  }

  const handleUpdateAddress = () => {
    if (!editingAddress) return

    onChange(addresses.map(addr => 
      addr.id === editingAddress.id ? editingAddress : addr
    ))
    setEditingAddress(null)
  }

  const handleDeleteAddress = (id: string) => {
    onChange(addresses.filter(addr => addr.id !== id))
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {/* Address List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <div 
              key={address.id}
              className="flex items-start justify-between p-4 rounded-lg border"
            >
              <div>
                <div className="font-medium">{address.type}</div>
                <div className="text-sm text-muted-foreground">
                  {address.street} {address.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {address.postalCode} {address.city}, {address.country}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  {address.isMain && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Main Address
                    </span>
                  )}
                  {address.isBlocked && (
                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                      Blocked
                    </span>
                  )}
                  {address.isOutdated && (
                    <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">
                      Outdated
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingAddress(address)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Address Form */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Address Type</Label>
              <Select
                value={editingAddress?.type || newAddress.type}
                onValueChange={(value) => 
                  editingAddress 
                    ? setEditingAddress({ ...editingAddress, type: value })
                    : setNewAddress({ ...newAddress, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ADDRESS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Country</Label>
              <Input
                value={editingAddress?.country || newAddress.country}
                onChange={(e) => 
                  editingAddress 
                    ? setEditingAddress({ ...editingAddress, country: e.target.value })
                    : setNewAddress({ ...newAddress, country: e.target.value })
                }
                placeholder="Enter country"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label>Street</Label>
              <Input
                value={editingAddress?.street || newAddress.street}
                onChange={(e) => 
                  editingAddress 
                    ? setEditingAddress({ ...editingAddress, street: e.target.value })
                    : setNewAddress({ ...newAddress, street: e.target.value })
                }
                placeholder="Enter street name"
              />
            </div>
            <div>
              <Label>Number</Label>
              <Input
                value={editingAddress?.number || newAddress.number}
                onChange={(e) => 
                  editingAddress 
                    ? setEditingAddress({ ...editingAddress, number: e.target.value })
                    : setNewAddress({ ...newAddress, number: e.target.value })
                }
                placeholder="Enter number"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Postal Code</Label>
              <Input
                value={editingAddress?.postalCode || newAddress.postalCode}
                onChange={(e) => 
                  editingAddress 
                    ? setEditingAddress({ ...editingAddress, postalCode: e.target.value })
                    : setNewAddress({ ...newAddress, postalCode: e.target.value })
                }
                placeholder="Enter postal code"
              />
            </div>
            <div className="col-span-2">
              <Label>City</Label>
              <Input
                value={editingAddress?.city || newAddress.city}
                onChange={(e) => 
                  editingAddress 
                    ? setEditingAddress({ ...editingAddress, city: e.target.value })
                    : setNewAddress({ ...newAddress, city: e.target.value })
                }
                placeholder="Enter city"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Floor (Optional)</Label>
              <Input
                value={editingAddress?.floor || newAddress.floor}
                onChange={(e) => 
                  editingAddress 
                    ? setEditingAddress({ ...editingAddress, floor: e.target.value })
                    : setNewAddress({ ...newAddress, floor: e.target.value })
                }
                placeholder="Enter floor"
              />
            </div>
            <div>
              <Label>Apartment (Optional)</Label>
              <Input
                value={editingAddress?.apartment || newAddress.apartment}
                onChange={(e) => 
                  editingAddress 
                    ? setEditingAddress({ ...editingAddress, apartment: e.target.value })
                    : setNewAddress({ ...newAddress, apartment: e.target.value })
                }
                placeholder="Enter apartment"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={editingAddress?.isMain || newAddress.isMain}
                onCheckedChange={(checked) => 
                  editingAddress 
                    ? setEditingAddress({ ...editingAddress, isMain: checked })
                    : setNewAddress({ ...newAddress, isMain: checked })
                }
              />
              <Label>Set as main address</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={editingAddress?.isBlocked || newAddress.isBlocked}
                onCheckedChange={(checked) => 
                  editingAddress 
                    ? setEditingAddress({ ...editingAddress, isBlocked: checked })
                    : setNewAddress({ ...newAddress, isBlocked: checked })
                }
              />
              <Label>Address blocked</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={editingAddress?.isOutdated || newAddress.isOutdated}
                onCheckedChange={(checked) => 
                  editingAddress 
                    ? setEditingAddress({ ...editingAddress, isOutdated: checked })
                    : setNewAddress({ ...newAddress, isOutdated: checked })
                }
              />
              <Label>Address out of date</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {editingAddress ? (
              <>
                <Button variant="outline" onClick={() => setEditingAddress(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateAddress}>
                  Update Address
                </Button>
              </>
            ) : (
              <Button onClick={handleAddAddress}>
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}