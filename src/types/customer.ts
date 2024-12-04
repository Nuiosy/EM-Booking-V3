export interface CustomerAddress {
  id: string
  type: string
  street: string
  number: string
  additionalInfo?: string
  postalCode: string
  city: string
  country: string
  isMain: boolean
  isBlocked: boolean
  isOutdated: boolean
  floor?: string
  apartment?: string
}

export interface CustomerContact {
  id: string
  type: string
  value: string
  comment?: string
}

export interface CustomerBankAccount {
  id: string
  accountHolder: string
  bankName: string
  iban: string
  bic: string
  accountNumber?: string
  bankCode?: string
  country: string
}

export interface CustomerCard {
  id: string
  owner: string
  type: string
  number: string
  validUntil: string
  comment?: string
}

export interface CustomerID {
  id: string
  type: string
  country: string
  number: string
  issuer: string
  dateOfIssue: string
  validUntil: string
  firstName: string
  lastName: string
  birthName?: string
  placeOfBirth?: string
  dateOfBirth?: string
  comment?: string
}

export interface CustomerAppointment {
  id: string
  category: string
  textBlock?: string
  subject: string
  createdAt: string
  dueDate: string
  priority: string
  status: string
  author: string
  editor?: string
  type: string
  description: string
}

export interface CustomerPreferences {
  travelPreferences: string[]
  interests: string[]
  groupMembership: string[]
  generalNotes: string
  adviceType: string
  languages: string[]
  healthNotes: string
  financialNotes: string
  specialRequirements: string
}

export interface Customer {
  id: string
  customerNumber: string
  oldCustomerNumber?: string
  type: string
  category: string
  customerSince: string
  serviceRepresentative?: string
  
  // Personal Information
  salutation: string
  gender: string
  academicDegree?: string
  nobleTitle?: string
  firstName: string
  lastName: string
  otherFirstNames?: string
  birthName?: string
  dateOfBirth?: string
  placeOfBirth?: string
  language: string
  nationality: string
  religion?: string
  weddingDate?: string
  recommendedBy?: string
  
  // Financial Information
  debtorNumber?: string
  creditorNumber?: string
  creditLimit?: number
  currency: string
  branch?: string
  costCenter?: string
  paymentType: string
  paymentDueDate?: string
  outputMedium: string
  
  // Options
  isInvisible: boolean
  isBlocked: boolean
  isDunningBlocked: boolean
  cashPaymentOnly: boolean
  isDeceased: boolean
  
  // Related Data
  addresses: CustomerAddress[]
  contacts: CustomerContact[]
  preferences: CustomerPreferences
  bankAccounts: CustomerBankAccount[]
  cards: CustomerCard[]
  appointments: CustomerAppointment[]
  ids: CustomerID[]
  
  createdAt: string
  updatedAt: string
}