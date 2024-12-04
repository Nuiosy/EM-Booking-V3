import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Customer } from "@/types/customer"
import { 
  CUSTOMER_TYPES,
  CUSTOMER_CATEGORIES,
  SALUTATIONS,
  GENDERS,
  LANGUAGES,
  NATIONALITIES,
  RELIGIONS,
  CURRENCIES,
  PAYMENT_TYPES,
  PAYMENT_DUE_DATES,
  OUTPUT_MEDIA 
} from "@/lib/constants/customerData"

interface PersonalInfoTabProps {
  data: Partial<Customer>
  onChange: (field: string, value: any) => void
  validationErrors: string[]
}

export function PersonalInfoTab({ data, onChange, validationErrors }: PersonalInfoTabProps) {
  // Helper function to ensure we never pass null to inputs
  const getInputValue = (value: any) => value ?? ""

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {/* Basic Information */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label className={validationErrors.includes('customer_type') ? 'text-destructive' : ''}>
              Customer Type *
            </Label>
            <Select
              value={getInputValue(data.customer_type)}
              onValueChange={(value) => onChange('customer_type', value)}
            >
              <SelectTrigger className={validationErrors.includes('customer_type') ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {CUSTOMER_TYPES.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Category</Label>
            <Select
              value={getInputValue(data.category)}
              onValueChange={(value) => onChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CUSTOMER_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Customer Since</Label>
            <Input
              type="date"
              value={getInputValue(data.customer_since)}
              onChange={(e) => onChange('customer_since', e.target.value)}
            />
          </div>
          <div>
            <Label>Service Representative</Label>
            <Select
              value={getInputValue(data.service_representative)}
              onValueChange={(value) => onChange('service_representative', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select representative" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john">John Smith</SelectItem>
                <SelectItem value="sarah">Sarah Johnson</SelectItem>
                <SelectItem value="michael">Michael Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Personal Details */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label className={validationErrors.includes('salutation') ? 'text-destructive' : ''}>
              Salutation *
            </Label>
            <Select
              value={getInputValue(data.salutation)}
              onValueChange={(value) => onChange('salutation', value)}
            >
              <SelectTrigger className={validationErrors.includes('salutation') ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select salutation" />
              </SelectTrigger>
              <SelectContent>
                {SALUTATIONS.map((salutation) => (
                  <SelectItem key={salutation} value={salutation}>{salutation}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Gender</Label>
            <Select
              value={getInputValue(data.gender)}
              onValueChange={(value) => onChange('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((gender) => (
                  <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Academic Degree</Label>
            <Input
              value={getInputValue(data.academic_degree)}
              onChange={(e) => onChange('academic_degree', e.target.value)}
              placeholder="Enter degree"
            />
          </div>
          <div>
            <Label>Noble Title</Label>
            <Input
              value={getInputValue(data.noble_title)}
              onChange={(e) => onChange('noble_title', e.target.value)}
              placeholder="Enter title"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className={validationErrors.includes('first_name') ? 'text-destructive' : ''}>
              First Name *
            </Label>
            <Input
              value={getInputValue(data.first_name)}
              onChange={(e) => onChange('first_name', e.target.value)}
              placeholder="Enter first name"
              className={validationErrors.includes('first_name') ? 'border-destructive' : ''}
            />
          </div>
          <div>
            <Label className={validationErrors.includes('last_name') ? 'text-destructive' : ''}>
              Last Name *
            </Label>
            <Input
              value={getInputValue(data.last_name)}
              onChange={(e) => onChange('last_name', e.target.value)}
              placeholder="Enter last name"
              className={validationErrors.includes('last_name') ? 'border-destructive' : ''}
            />
          </div>
          <div>
            <Label>Other First Names</Label>
            <Input
              value={getInputValue(data.other_first_names)}
              onChange={(e) => onChange('other_first_names', e.target.value)}
              placeholder="Enter other names"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Birth Name</Label>
            <Input
              value={getInputValue(data.birth_name)}
              onChange={(e) => onChange('birth_name', e.target.value)}
              placeholder="Enter birth name"
            />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={getInputValue(data.date_of_birth)}
              onChange={(e) => onChange('date_of_birth', e.target.value)}
            />
          </div>
          <div>
            <Label>Place of Birth</Label>
            <Input
              value={getInputValue(data.place_of_birth)}
              onChange={(e) => onChange('place_of_birth', e.target.value)}
              placeholder="Enter place of birth"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Language</Label>
            <Select
              value={getInputValue(data.language)}
              onValueChange={(value) => onChange('language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Nationality</Label>
            <Select
              value={getInputValue(data.nationality)}
              onValueChange={(value) => onChange('nationality', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select nationality" />
              </SelectTrigger>
              <SelectContent>
                {NATIONALITIES.map((nat) => (
                  <SelectItem key={nat.code} value={nat.code}>{nat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Religion</Label>
            <Select
              value={getInputValue(data.religion)}
              onValueChange={(value) => onChange('religion', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select religion" />
              </SelectTrigger>
              <SelectContent>
                {RELIGIONS.map((religion) => (
                  <SelectItem key={religion} value={religion}>{religion}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className={validationErrors.includes('email') ? 'text-destructive' : ''}>
              Email *
            </Label>
            <Input
              value={getInputValue(data.email)}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="Enter email"
              className={validationErrors.includes('email') ? 'border-destructive' : ''}
            />
          </div>
          <div>
            <Label className={validationErrors.includes('phone') ? 'text-destructive' : ''}>
              Phone *
            </Label>
            <Input
              value={getInputValue(data.phone)}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="Enter phone number"
              className={validationErrors.includes('phone') ? 'border-destructive' : ''}
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Currency</Label>
            <Select
              value={getInputValue(data.currency)}
              onValueChange={(value) => onChange('currency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.symbol} - {curr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Payment Type</Label>
            <Select
              value={getInputValue(data.payment_type)}
              onValueChange={(value) => onChange('payment_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Payment Due Date</Label>
            <Select
              value={getInputValue(data.payment_due_date)}
              onValueChange={(value) => onChange('payment_due_date', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select due date" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_DUE_DATES.map((date) => (
                  <SelectItem key={date} value={date}>{date}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Credit Limit</Label>
            <Input
              type="number"
              value={getInputValue(data.credit_limit)}
              onChange={(e) => onChange('credit_limit', parseFloat(e.target.value))}
              placeholder="Enter credit limit"
            />
          </div>
          <div>
            <Label>Output Medium</Label>
            <Select
              value={getInputValue(data.output_medium)}
              onValueChange={(value) => onChange('output_medium', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select output medium" />
              </SelectTrigger>
              <SelectContent>
                {OUTPUT_MEDIA.map((medium) => (
                  <SelectItem key={medium} value={medium}>{medium}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Wedding Date</Label>
            <Input
              type="date"
              value={getInputValue(data.wedding_date)}
              onChange={(e) => onChange('wedding_date', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}