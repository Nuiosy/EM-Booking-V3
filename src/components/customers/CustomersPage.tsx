import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPlus, Filter, RefreshCw, Hash, User, Mail, Phone, Pencil, Trash2, Loader2, Search } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { customerService } from '@/lib/services/customerService'
import { CustomerForm } from "./CustomerForm"

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  mobile: string | null
  customer_type: 'private' | 'business'
  category: string | null
  customer_number: string
  salutation: string
}

interface SearchFilters {
  customerNumber: string
  name: string
  email: string
  phone: string
  type: string
  category: string
  dateRange: {
    from: string
    to: string
  }
  status: string
  nationality: string
  language: string
  representative: string
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    customerNumber: '',
    name: '',
    email: '',
    phone: '',
    type: 'all',
    category: 'all',
    dateRange: {
      from: '',
      to: ''
    },
    status: 'all',
    nationality: '',
    language: 'all',
    representative: 'all'
  })
  const { toast } = useToast()

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      let query = supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (searchFilters.customerNumber) {
        query = query.ilike('customer_number', `%${searchFilters.customerNumber}%`)
      }
      if (searchFilters.name) {
        query = query.or(`first_name.ilike.%${searchFilters.name}%,last_name.ilike.%${searchFilters.name}%`)
      }
      if (searchFilters.email) {
        query = query.ilike('email', `%${searchFilters.email}%`)
      }
      if (searchFilters.phone) {
        query = query.or(`phone.ilike.%${searchFilters.phone}%,mobile.ilike.%${searchFilters.phone}%`)
      }
      if (searchFilters.type !== 'all') {
        query = query.eq('customer_type', searchFilters.type)
      }
      if (searchFilters.category !== 'all') {
        query = query.eq('category', searchFilters.category)
      }
      if (searchFilters.dateRange.from) {
        query = query.gte('customer_since', searchFilters.dateRange.from)
      }
      if (searchFilters.dateRange.to) {
        query = query.lte('customer_since', searchFilters.dateRange.to)
      }
      if (searchFilters.status !== 'all') {
        if (searchFilters.status === 'blocked') {
          query = query.eq('isBlocked', true)
        } else if (searchFilters.status === 'inactive') {
          query = query.eq('isInvisible', true)
        }
      }
      if (searchFilters.nationality) {
        query = query.ilike('nationality', `%${searchFilters.nationality}%`)
      }
      if (searchFilters.language !== 'all') {
        query = query.eq('language', searchFilters.language)
      }
      if (searchFilters.representative !== 'all') {
        query = query.eq('service_representative', searchFilters.representative)
      }

      const { data, error } = await query

      if (error) throw error
      setCustomers(data || [])
    } catch (err) {
      console.error('Error fetching customers:', err)
      setError('Failed to fetch customers')
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch and real-time subscription setup
  useEffect(() => {
    fetchCustomers()

    // Subscribe to ALL changes on the customers table
    const channel = supabase.channel('customers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        () => {
          fetchCustomers() // Refresh the list when any change occurs
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleNewCustomer = () => {
    setSelectedCustomer(null)
    setIsEditing(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsEditing(true)
  }

  const handleDeleteCustomer = async (id: string) => {
    try {
      await customerService.delete(id)
      setDeleteCustomerId(null)
      await fetchCustomers() // Refresh list after deletion
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (selectedCustomer) {
        // Update existing customer
        await customerService.update(selectedCustomer.id, data)
      } else {
        // Create new customer
        await customerService.create(data)
      }
      
      setIsEditing(false)
      await fetchCustomers() // Refresh list after changes
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  if (isEditing) {
    return (
      <CustomerForm
        customer={selectedCustomer}
        onSubmit={handleSubmit}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage your customer database
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewCustomer}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Customer
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button variant="outline" onClick={() => fetchCustomers()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Advanced Search Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Customer Number</Label>
                  <div className="relative">
                    <Hash className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by number"
                      value={searchFilters.customerNumber}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, customerNumber: e.target.value }))}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <div className="relative">
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name"
                      value={searchFilters.name}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by email"
                      value={searchFilters.email}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by phone"
                      value={searchFilters.phone}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Customer Type</Label>
                  <Select
                    value={searchFilters.type}
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={searchFilters.category}
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="new">New Customer</SelectItem>
                      <SelectItem value="regular">Regular Customer</SelectItem>
                      <SelectItem value="vip">VIP Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={searchFilters.status}
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={searchFilters.language}
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Range and Actions */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Customer Since (From)</Label>
                  <Input
                    type="date"
                    value={searchFilters.dateRange.from}
                    onChange={(e) => setSearchFilters(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, from: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Customer Since (To)</Label>
                  <Input
                    type="date"
                    value={searchFilters.dateRange.to}
                    onChange={(e) => setSearchFilters(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, to: e.target.value }
                    }))}
                  />
                </div>
                <div className="col-span-2 flex items-end gap-2">
                  <Button className="flex-1" onClick={() => fetchCustomers()}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchFilters({
                        customerNumber: '',
                        name: '',
                        email: '',
                        phone: '',
                        type: 'all',
                        category: 'all',
                        dateRange: {
                          from: '',
                          to: ''
                        },
                        status: 'all',
                        nationality: '',
                        language: 'all',
                        representative: 'all'
                      })
                      fetchCustomers()
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading customers...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="space-y-4">
                    <p className="text-destructive">{error}</p>
                    <Button onClick={() => fetchCustomers()}>
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p>No customers found. Add your first customer to get started.</p>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {customer.salutation} {customer.first_name} {customer.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        #{customer.customer_number}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{customer.customer_type}</span>
                  </TableCell>
                  <TableCell>{customer.category}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCustomer(customer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setDeleteCustomerId(customer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={!!deleteCustomerId} onOpenChange={() => setDeleteCustomerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteCustomerId && handleDeleteCustomer(deleteCustomerId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}