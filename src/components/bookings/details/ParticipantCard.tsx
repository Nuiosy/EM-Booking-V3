import { Button } from "@/components/ui/button"
import { Participant } from "@/types/participant"
import { User, Calendar, Ticket, CreditCard } from "lucide-react"

interface ParticipantCardProps {
  participant: Participant
  onEdit: (participant: Participant) => void
  onDelete: (id: string) => void
}

export function ParticipantCard({ participant, onEdit, onDelete }: ParticipantCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <User className="h-8 w-8 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">
              {participant.salutation} {participant.firstName} {participant.lastName}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
              {participant.dateOfBirth && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(participant.dateOfBirth).toLocaleDateString()}
                </div>
              )}
              {participant.ticketNumber && (
                <div className="flex items-center">
                  <Ticket className="h-4 w-4 mr-1" />
                  {participant.ticketNumber}
                </div>
              )}
              {participant.passportNumber && (
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-1" />
                  {participant.passportNumber}
                  {participant.passportExpiry && ` (Exp: ${new Date(participant.passportExpiry).toLocaleDateString()})`}
                </div>
              )}
            </div>
            {participant.comments && (
              <p className="text-sm text-muted-foreground mt-2">
                {participant.comments}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(participant)}>
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-destructive"
            onClick={() => onDelete(participant.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}