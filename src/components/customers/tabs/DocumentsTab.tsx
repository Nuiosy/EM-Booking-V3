import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CustomerID } from "@/types/customer"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { ID_TYPES } from "@/lib/constants/customerData"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DocumentsTabProps {
  ids: CustomerID[]
  onChange: (ids: CustomerID[]) => void
}

export function DocumentsTab({ ids, onChange }: DocumentsTabProps) {
  const [editingId, setEditingId] = useState<CustomerID | null>(null)
  const [newId, setNewId] = useState<Partial<CustomerID>>({
    type: '',
    country: '',
    number: '',
    issuer: '',
    dateOfIssue: '',
    validUntil: '',
    firstName: '',
    lastName: '',
    birthName: '',
    placeOfBirth: '',
    dateOfBirth: '',
    comment: ''
  })

  const handleAddId = () => {
    if (!newId.type || !newId.number) {
      alert("Please fill in all required fields")
      return
    }

    const id: CustomerID = {
      id: Math.random().toString(36).substr(2, 9),
      ...newId as Omit<CustomerID, 'id'>
    }

    onChange([...ids, id])
    setNewId({
      type: '',
      country: '',
      number: '',
      issuer: '',
      dateOfIssue: '',
      validUntil: '',
      firstName: '',
      lastName: '',
      birthName: '',
      placeOfBirth: '',
      dateOfBirth: '',
      comment: ''
    })
  }

  const handleUpdateId = () => {
    if (!editingId) return

    onChange(ids.map(id => 
      id.id === editingId.id ? editingId : id
    ))
    setEditingId(null)
  }

  const handleDeleteId = (id: string) => {
    onChange(ids.filter(doc => doc.id !== id))
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {/* ID List */}
        <div className="space-y-4">
          {ids.map((id) => (
            <div 
              key={id.id}
              className="flex items-start justify-between p-4 rounded-lg border"
            >
              <div>
                <div className="font-medium">{id.type}</div>
                <div className="text-sm text-muted-foreground">
                  Number: {id.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {id.firstName} {id.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  Valid until: {id.validUntil}
                </div>
                {id.comment && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {id.comment}
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingId(id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteId(id.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit ID Form */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">
            {editingId ? 'Edit ID' : 'Add New ID'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ID Type</Label>
              <Select
                value={editingId?.type || newId.type}
                onValueChange={(value) => 
                  editingId 
                    ? setEditingId({ ...editingId, type: value })
                    : setNewId({ ...newId, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ID_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Country</Label>
              <Input
                value={editingId?.country || newId.country}
                onChange={(e) => 
                  editingId 
                    ? setEditingId({ ...editingId, country: e.target.value })
                    : setNewId({ ...newId, country: e.target.value })
                }
                placeholder="Enter country"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ID Number</Label>
              <Input
                value={editingId?.number || newId.number}
                onChange={(e) => 
                  editingId 
                    ? setEditingId({ ...editingId, number: e.target.value })
                    : setNewId({ ...newId, number: e.target.value })
                }
                placeholder="Enter ID number"
              />
            </div>
            <div>
              <Label>Issuer</Label>
              <Input
                value={editingId?.issuer || newId.issuer}
                onChange={(e) => 
                  editingId 
                    ? setEditingId({ ...editingId, issuer: e.target.value })
                    : setNewId({ ...newId, issuer: e.target.value })
                }
                placeholder="Enter issuer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date of Issue</Label>
              <Input
                type="date"
                value={editingId?.dateOfIssue || newId.dateOfIssue}
                onChange={(e) => 
                  editingId 
                    ? setEditingId({ ...editingId, dateOfIssue: e.target.value })
                    : setNewId({ ...newId, dateOfIssue: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Valid Until</Label>
              <Input
                type="date"
                value={editingId?.validUntil || newId.validUntil}
                onChange={(e) => 
                  editingId 
                    ? setEditingId({ ...editingId, validUntil: e.target.value })
                    : setNewId({ ...newId, validUntil: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                value={editingId?.firstName || newId.firstName}
                onChange={(e) => 
                  editingId 
                    ? setEditingId({ ...editingId, firstName: e.target.value })
                    : setNewId({ ...newId, firstName: e.target.value })
                }
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={editingId?.lastName || newId.lastName}
                onChange={(e) => 
                  editingId 
                    ? setEditingId({ ...editingId, lastName: e.target.value })
                    : setNewId({ ...newId, lastName: e.target.value })
                }
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Birth Name</Label>
              <Input
                value={editingId?.birthName || newId.birthName}
                onChange={(e) => 
                  editingId 
                    ? setEditingId({ ...editingId, birthName: e.target.value })
                    : setNewId({ ...newId, birthName: e.target.value })
                }
                placeholder="Enter birth name"
              />
            </div>
            <div>
              <Label>Place of Birth</Label>
              <Input
                value={editingId?.placeOfBirth || newId.placeOfBirth}
                onChange={(e) => 
                  editingId 
                    ? setEditingId({ ...editingId, placeOfBirth: e.target.value })
                    : setNewId({ ...newId, placeOfBirth: e.target.value })
                }
                placeholder="Enter place of birth"
              />
            </div>
          </div>

          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={editingId?.dateOfBirth || newId.dateOfBirth}
              onChange={(e) => 
                editingId 
                  ? setEditingId({ ...editingId, dateOfBirth: e.target.value })
                  : setNewId({ ...newId, dateOfBirth: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Comment</Label>
            <Textarea
              value={editingId?.comment || newId.comment}
              onChange={(e) => 
                editingId 
                  ? setEditingId({ ...editingId, comment: e.target.value })
                  : setNewId({ ...newId, comment: e.target.value })
              }
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            {editingId ? (
              <>
                <Button variant="outline" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateId}>
                  Update ID
                </Button>
              </>
            ) : (
              <Button onClick={handleAddId}>
                <Plus className="h-4 w-4 mr-2" />
                Add ID
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}