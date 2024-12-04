import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CustomerContact } from "@/types/customer"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { CONTACT_TYPES } from "@/lib/constants/customerData"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ContactsTabProps {
  contacts: CustomerContact[]
  onChange: (contacts: CustomerContact[]) => void
}

export function ContactsTab({ contacts, onChange }: ContactsTabProps) {
  const [editingContact, setEditingContact] = useState<CustomerContact | null>(null)
  const [newContact, setNewContact] = useState<Partial<CustomerContact>>({
    type: '',
    value: '',
    comment: ''
  })

  const handleAddContact = () => {
    if (!newContact.type || !newContact.value) {
      alert("Please fill in all required fields")
      return
    }

    const contact: CustomerContact = {
      id: Math.random().toString(36).substr(2, 9),
      ...newContact as Omit<CustomerContact, 'id'>
    }

    onChange([...contacts, contact])
    setNewContact({
      type: '',
      value: '',
      comment: ''
    })
  }

  const handleUpdateContact = () => {
    if (!editingContact) return

    onChange(contacts.map(contact => 
      contact.id === editingContact.id ? editingContact : contact
    ))
    setEditingContact(null)
  }

  const handleDeleteContact = (id: string) => {
    onChange(contacts.filter(contact => contact.id !== id))
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {/* Contact List */}
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div 
              key={contact.id}
              className="flex items-start justify-between p-4 rounded-lg border"
            >
              <div>
                <div className="font-medium">{contact.type}</div>
                <div className="text-sm text-muted-foreground">
                  {contact.value}
                </div>
                {contact.comment && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {contact.comment}
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingContact(contact)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Contact Form */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">
            {editingContact ? 'Edit Contact' : 'Add New Contact'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contact Type</Label>
              <Select
                value={editingContact?.type || newContact.type}
                onValueChange={(value) => 
                  editingContact 
                    ? setEditingContact({ ...editingContact, type: value })
                    : setNewContact({ ...newContact, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Value</Label>
              <Input
                value={editingContact?.value || newContact.value}
                onChange={(e) => 
                  editingContact 
                    ? setEditingContact({ ...editingContact, value: e.target.value })
                    : setNewContact({ ...newContact, value: e.target.value })
                }
                placeholder="Enter contact value"
              />
            </div>
          </div>

          <div>
            <Label>Comment</Label>
            <Textarea 
              value={editingContact?.comment || newContact.comment}
              onChange={(e) => 
                editingContact 
                  ? setEditingContact({ ...editingContact, comment: e.target.value })
                  : setNewContact({ ...newContact, comment: e.target.value })
              }
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            {editingContact ? (
              <>
                <Button variant="outline" onClick={() => setEditingContact(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateContact}>
                  Update Contact
                </Button>
              </>
            ) : (
              <Button onClick={handleAddContact}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}