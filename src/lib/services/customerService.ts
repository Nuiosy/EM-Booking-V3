import { supabase } from '@/lib/supabase'
import type { Customer } from '@/types/customer'

export const customerService = {
  // Generate unique customer number
  async generateCustomerNumber() {
    try {
      const date = new Date()
      const year = date.getFullYear().toString().slice(-2)
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      
      // Get the latest customer number to ensure uniqueness
      const { data: latestCustomer } = await supabase
        .from('customers')
        .select('customer_number')
        .order('created_at', { ascending: false })
        .limit(1)

      let sequence = 1
      if (latestCustomer?.[0]?.customer_number) {
        const lastNumber = parseInt(latestCustomer[0].customer_number.slice(-4))
        sequence = lastNumber + 1
      }

      return `C${year}${month}${sequence.toString().padStart(4, '0')}`
    } catch (error) {
      console.error('Error generating customer number:', error)
      throw new Error('Failed to generate customer number')
    }
  },

  // Create new customer
  async create(data: Partial<Customer>) {
    try {
      // Validate required fields
      if (!data.first_name || !data.last_name || !data.email || !data.phone) {
        throw new Error('Missing required fields')
      }

      // Generate customer number if not provided
      const customerNumber = await this.generateCustomerNumber()

      // Transform data to match database schema
      const customerData = {
        customer_number: customerNumber,
        customer_type: data.customer_type?.toLowerCase() || 'private',
        category: data.category || 'New Customer',
        customer_since: data.customer_since || new Date().toISOString().split('T')[0],
        
        // Personal Information
        salutation: data.salutation || '',
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        mobile: data.mobile || null,
        
        // Additional Information
        language: data.language || 'en',
        nationality: data.nationality || 'DE',
        gender: data.gender || '',
        date_of_birth: data.date_of_birth || null,
        
        // Financial Information
        currency: data.currency || 'EUR',
        payment_type: data.payment_type || 'Invoice',
        output_medium: data.output_medium || 'Email',
        
        // Options
        is_invisible: data.is_invisible || false,
        is_blocked: data.is_blocked || false,
        is_dunning_blocked: data.is_dunning_blocked || false,
        cash_payment_only: data.cash_payment_only || false,
        is_deceased: data.is_deceased || false
      }

      // Create customer record
      const { data: customer, error } = await supabase
        .from('customers')
        .insert(customerData)
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        throw new Error(error.message)
      }

      return customer
    } catch (error: any) {
      console.error('Failed to create customer:', error)
      throw new Error(`Failed to create customer: ${error.message}`)
    }
  },

  // Update existing customer
  async update(id: string, data: Partial<Customer>) {
    try {
      // Validate required fields for update
      if (data.first_name === '' || data.last_name === '' || data.email === '' || data.phone === '') {
        throw new Error('Required fields cannot be empty')
      }

      const customerData = {
        customer_type: data.customer_type?.toLowerCase(),
        category: data.category,
        
        salutation: data.salutation,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        mobile: data.mobile,
        
        language: data.language,
        nationality: data.nationality,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        
        currency: data.currency,
        payment_type: data.payment_type,
        output_medium: data.output_medium,
        
        is_invisible: data.is_invisible,
        is_blocked: data.is_blocked,
        is_dunning_blocked: data.is_dunning_blocked,
        cash_payment_only: data.cash_payment_only,
        is_deceased: data.is_deceased
      }

      // Remove undefined values
      Object.keys(customerData).forEach(key => 
        customerData[key] === undefined && delete customerData[key]
      )

      const { data: customer, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return customer
    } catch (error: any) {
      console.error('Failed to update customer:', error)
      throw new Error(`Failed to update customer: ${error.message}`)
    }
  },

  // Delete customer
  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error: any) {
      console.error('Failed to delete customer:', error)
      throw new Error(`Failed to delete customer: ${error.message}`)
    }
  },

  // Get customer by ID
  async getById(id: string) {
    try {
      const { data: customer, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return customer
    } catch (error: any) {
      console.error('Failed to get customer:', error)
      throw new Error(`Failed to get customer: ${error.message}`)
    }
  },

  // Search customers
  async search(query: string) {
    try {
      const { data: customers, error } = await supabase
        .from('customers')
        .select('*')
        .or(`
          first_name.ilike.%${query}%,
          last_name.ilike.%${query}%,
          email.ilike.%${query}%,
          customer_number.ilike.%${query}%
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return customers
    } catch (error: any) {
      console.error('Failed to search customers:', error)
      throw new Error(`Failed to search customers: ${error.message}`)
    }
  }
}