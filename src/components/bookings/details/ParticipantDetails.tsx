import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ParticipantCard } from "./ParticipantCard"
import { ParticipantForm } from "./ParticipantForm"
import { Participant } from "@/types/participant"
import { useToast } from "@/components/ui/use-toast"

const initialParticipants: Participant[] = [
  {
    id: "1",
    salutation: "Dr.",
    lastName: "Schmidt",
    firstName: "Thomas",
    dateOfBirth: "1980-05-15",
    ticketNumber: "220-1234567890",
    passportNumber: "C01X00T47",
    passportExpiry: "2028-05-14",
    comments: "Vegetarian meal requested"
  }
]

export function ParticipantDetails() {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
  const [isAddingParticipant, setIsAddingParticipant] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)
  const { toast } = useToast()

  const handleAddParticipant = (data: Partial<Participant>) => {
    const newParticipant = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    } as Participant
    
    setParticipants([...participants, newParticipant])
    setIsAddingParticipant(false)
    toast({
      title: "Participant Added",
      description: `${data.firstName} ${data.lastName} has been added successfully.`
    })
  }

  const handleEditParticipant = (data: Partial<Participant>) => {
    if (editingParticipant) {
      setParticipants(participants.map(p => 
        p.id === editingParticipant.id ? { ...p, ...data } : p
      ))
      setEditingParticipant(null)
      toast({
        title: "Participant Updated",
        description: `${data.firstName} ${data.lastName} has been updated successfully.`
      })
    }
  }

  const handleDeleteParticipant = (id: string) => {
    const participantToDelete = participants.find(p => p.id === id)
    if (window.confirm(`Are you sure you want to delete ${participantToDelete?.firstName} ${participantToDelete?.lastName}?`)) {
      setParticipants(participants.filter(p => p.id !== id))
      toast({
        title: "Participant Deleted",
        description: `${participantToDelete?.firstName} ${participantToDelete?.lastName} has been deleted.`,
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Travel Participants</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setIsAddingParticipant(true)}
          disabled={isAddingParticipant || !!editingParticipant}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Participant
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {participants.map((participant) => (
            !editingParticipant || editingParticipant.id !== participant.id ? (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                onEdit={setEditingParticipant}
                onDelete={handleDeleteParticipant}
              />
            ) : (
              <ParticipantForm
                key={participant.id}
                initialData={participant}
                onSubmit={handleEditParticipant}
                onCancel={() => setEditingParticipant(null)}
              />
            )
          ))}

          {isAddingParticipant && (
            <ParticipantForm
              onSubmit={handleAddParticipant}
              onCancel={() => setIsAddingParticipant(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}