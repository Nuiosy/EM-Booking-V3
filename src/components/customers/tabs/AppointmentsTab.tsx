import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CustomerAppointment } from "@/types/customer"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { 
  APPOINTMENT_CATEGORIES,
  APPOINTMENT_PRIORITIES,
  APPOINTMENT_STATUSES 
} from "@/lib/constants/customerData"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AppointmentsTabProps {
  appointments: CustomerAppointment[]
  onChange: (appointments: CustomerAppointment[]) => void
}

export function AppointmentsTab({ appointments, onChange }: AppointmentsTabProps) {
  const [editingAppointment, setEditingAppointment] = useState<CustomerAppointment | null>(null)
  const [newAppointment, setNewAppointment] = useState<Partial<CustomerAppointment>>({
    category: '',
    textBlock: '',
    subject: '',
    createdAt: new Date().toISOString(),
    dueDate: '',
    priority: '',
    status: '',
    author: '',
    editor: '',
    type: '',
    description: ''
  })

  const handleAddAppointment = () => {
    if (!newAppointment.subject || !newAppointment.dueDate) {
      alert("Please fill in all required fields")
      return
    }

    const appointment: CustomerAppointment = {
      id: Math.random().toString(36).substr(2, 9),
      ...newAppointment as Omit<CustomerAppointment, 'id'>
    }

    onChange([...appointments, appointment])
    setNewAppointment({
      category: '',
      textBlock: '',
      subject: '',
      createdAt: new Date().toISOString(),
      dueDate: '',
      priority: '',
      status: '',
      author: '',
      editor: '',
      type: '',
      description: ''
    })
  }

  const handleUpdateAppointment = () => {
    if (!editingAppointment) return

    onChange(appointments.map(appointment => 
      appointment.id === editingAppointment.id ? editingAppointment : appointment
    ))
    setEditingAppointment(null)
  }

  const handleDeleteAppointment = (id: string) => {
    onChange(appointments.filter(appointment => appointment.id !== id))
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id}
              className="flex items-start justify-between p-4 rounded-lg border"
            >
              <div>
                <div className="font-medium">{appointment.subject}</div>
                <div className="text-sm text-muted-foreground">
                  Due: {new Date(appointment.dueDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Category: {appointment.category} | Priority: {appointment.priority}
                </div>
                <div className="text-sm text-muted-foreground">
                  Status: {appointment.status}
                </div>
                {appointment.description && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {appointment.description}
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingAppointment(appointment)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAppointment(appointment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Appointment Form */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">
            {editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select
                value={editingAppointment?.category || newAppointment.category}
                onValueChange={(value) => 
                  editingAppointment 
                    ? setEditingAppointment({ ...editingAppointment, category: value })
                    : setNewAppointment({ ...newAppointment, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Text Block</Label>
              <Input
                value={editingAppointment?.textBlock || newAppointment.textBlock}
                onChange={(e) => 
                  editingAppointment 
                    ? setEditingAppointment({ ...editingAppointment, textBlock: e.target.value })
                    : setNewAppointment({ ...newAppointment, textBlock: e.target.value })
                }
                placeholder="Enter text block"
              />
            </div>
          </div>

          <div>
            <Label>Subject</Label>
            <Input
              value={editingAppointment?.subject || newAppointment.subject}
              onChange={(e) => 
                editingAppointment 
                  ? setEditingAppointment({ ...editingAppointment, subject: e.target.value })
                  : setNewAppointment({ ...newAppointment, subject: e.target.value })
              }
              placeholder="Enter subject"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Due Date</Label>
              <Input
                type="datetime-local"
                value={editingAppointment?.dueDate || newAppointment.dueDate}
                onChange={(e) => 
                  editingAppointment 
                    ? setEditingAppointment({ ...editingAppointment, dueDate: e.target.value })
                    : setNewAppointment({ ...newAppointment, dueDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={editingAppointment?.priority || newAppointment.priority}
                onValueChange={(value) => 
                  editingAppointment 
                    ? setEditingAppointment({ ...editingAppointment, priority: value })
                    : setNewAppointment({ ...newAppointment, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select
                value={editingAppointment?.status || newAppointment.status}
                onValueChange={(value) => 
                  editingAppointment 
                    ? setEditingAppointment({ ...editingAppointment, status: value })
                    : setNewAppointment({ ...newAppointment, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Input
                value={editingAppointment?.type || newAppointment.type}
                onChange={(e) => 
                  editingAppointment 
                    ? setEditingAppointment({ ...editingAppointment, type: e.target.value })
                    : setNewAppointment({ ...newAppointment, type: e.target.value })
                }
                placeholder="Enter type"
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={editingAppointment?.description || newAppointment.description}
              onChange={(e) => 
                editingAppointment 
                  ? setEditingAppointment({ ...editingAppointment, description: e.target.value })
                  : setNewAppointment({ ...newAppointment, description: e.target.value })
              }
              placeholder="Enter description"
              className="h-24"
            />
          </div>

          <div className="flex justify-end space-x-2">
            {editingAppointment ? (
              <>
                <Button variant="outline" onClick={() => setEditingAppointment(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateAppointment}>
                  Update Appointment
                </Button>
              </>
            ) : (
              <Button onClick={handleAddAppointment}>
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}