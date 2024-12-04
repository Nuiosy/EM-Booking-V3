export interface Participant {
  id: string
  salutation: string
  lastName: string
  firstName: string
  dateOfBirth?: string
  ticketNumber?: string
  passportNumber?: string
  passportExpiry?: string
  comments?: string
}