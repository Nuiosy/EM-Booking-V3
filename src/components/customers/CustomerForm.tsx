import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfoTab } from "./tabs/PersonalInfoTab"
import { AddressesTab } from "./tabs/AddressesTab"
import { ContactsTab } from "./tabs/ContactsTab"
import { PaymentMethodsTab } from "./tabs/PaymentMethodsTab"
import { PreferencesTab } from "./tabs/PreferencesTab"
import { DocumentsTab } from "./tabs/DocumentsTab"
import { AppointmentsTab } from "./tabs/AppointmentsTab"
import { OptionsTab } from "./tabs/OptionsTab"
import { Customer } from "@/types/customer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface CustomerFormProps {
  customer?: Customer
  onSubmit: (data: Partial<Customer>) => void
  onCancel: () => void
}

export function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const { toast } = useToast()
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [formData, setFormData] = useState<Partial<Customer>>(customer || {
    customer_type: 'private',
    category: 'New Customer',
    customer_since: new Date().toISOString().split('T')[0],
    salutation: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    language: 'en',
    nationality: '',
    addresses: [],
    contacts: [],
    preferences: {
      travelPreferences: [],
      interests: [],
      groupMembership: [],
      generalNotes: '',
      adviceType: '',
      languages: [],
      healthNotes: '',
      financialNotes: '',
      specialRequirements: ''
    },
    bankAccounts: [],
    cards: [],
    appointments: [],
    ids: [],
    isInvisible: false,
    isBlocked: false,
    isDunningBlocked: false,
    cashPaymentOnly: false,
    isDeceased: false
  })

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = ['salutation', 'first_name', 'last_name', 'customer_type', 'email', 'phone']
    const missingFields = requiredFields.filter(field => !formData[field as keyof Customer])
    
    if (missingFields.length > 0) {
      setValidationErrors(missingFields)
      toast({
        title: "Validation Error",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      })
      return
    }

    // Clear validation errors if validation passes
    setValidationErrors([])

    // Clean up data before submission
    const cleanedData = {
      ...formData,
      // Convert dates to ISO strings
      customer_since: formData.customer_since ? new Date(formData.customer_since).toISOString() : undefined,
      date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString() : undefined,
      wedding_date: formData.wedding_date ? new Date(formData.wedding_date).toISOString() : undefined,
      // Remove any undefined or null values
      ...Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v != null)
      )
    }

    onSubmit(cleanedData)
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear validation error for this field if it exists
    if (validationErrors.includes(field)) {
      setValidationErrors(prev => prev.filter(f => f !== field))
    }
  }

  return (
    <div className="space-y-6">
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fill in the following required fields: {validationErrors.map(field => (
              <span key={field} className="font-medium">
                {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                {validationErrors[validationErrors.length - 1] !== field ? ', ' : ''}
              </span>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={onCancel}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {customer ? 'Update Customer' : 'Create Customer'}
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {customer ? 'Edit Customer' : 'New Customer'}
        </h2>
        <p className="text-muted-foreground">
          {customer ? 'Update customer information' : 'Add a new customer to your database'}
        </p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="w-full justify-start border-b h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="personal"
            className={`rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent ${
              validationErrors.length > 0 ? 'text-destructive' : ''
            }`}
          >
            Personal Info
          </TabsTrigger>
          <TabsTrigger 
            value="addresses"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Addresses
          </TabsTrigger>
          <TabsTrigger 
            value="contacts"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Contacts
          </TabsTrigger>
          <TabsTrigger 
            value="payment"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Payment Methods
          </TabsTrigger>
          <TabsTrigger 
            value="preferences"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Preferences
          </TabsTrigger>
          <TabsTrigger 
            value="documents"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Documents & IDs
          </TabsTrigger>
          <TabsTrigger 
            value="appointments"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Appointments
          </TabsTrigger>
          <TabsTrigger 
            value="options"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Options
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoTab 
            data={formData} 
            onChange={updateFormData}
            validationErrors={validationErrors}
          />
        </TabsContent>

        <TabsContent value="addresses">
          <AddressesTab 
            addresses={formData.addresses || []}
            onChange={(addresses) => updateFormData('addresses', addresses)}
          />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactsTab 
            contacts={formData.contacts || []}
            onChange={(contacts) => updateFormData('contacts', contacts)}
          />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentMethodsTab 
            bankAccounts={formData.bankAccounts || []}
            cards={formData.cards || []}
            onChange={(field, value) => updateFormData(field, value)}
          />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab 
            preferences={formData.preferences}
            onChange={(preferences) => updateFormData('preferences', preferences)}
          />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTab 
            ids={formData.ids || []}
            onChange={(ids) => updateFormData('ids', ids)}
          />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsTab 
            appointments={formData.appointments || []}
            onChange={(appointments) => updateFormData('appointments', appointments)}
          />
        </TabsContent>

        <TabsContent value="options">
          <OptionsTab 
            options={{
              isInvisible: formData.isInvisible || false,
              isBlocked: formData.isBlocked || false,
              isDunningBlocked: formData.isDunningBlocked || false,
              cashPaymentOnly: formData.cashPaymentOnly || false,
              isDeceased: formData.isDeceased || false
            }}
            onChange={(field, value) => updateFormData(field, value)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}