import { useState, useCallback } from 'react'
import { customerService } from '@/lib/services/customerService'
import { useToast } from '@/components/ui/use-toast'
import type { Customer } from '@/types/customer'

export function useCustomer() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleError = useCallback((error: Error) => {
    console.error('Customer operation error:', error)
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive'
    })
  }, [toast])

  const createCustomer = async (data: Partial<Customer>) => {
    try {
      setIsLoading(true)
      const customerNumber = await customerService.generateCustomerNumber()
      const customer = await customerService.create({
        ...data,
        customer_number: customerNumber
      })
      toast({
        title: 'Success',
        description: 'Customer created successfully'
      })
      return customer
    } catch (error) {
      handleError(error as Error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    try {
      setIsLoading(true)
      const customer = await customerService.update(id, data)
      toast({
        title: 'Success',
        description: 'Customer updated successfully'
      })
      return customer
    } catch (error) {
      handleError(error as Error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      setIsLoading(true)
      await customerService.delete(id)
      toast({
        title: 'Success',
        description: 'Customer deleted successfully'
      })
      return true
    } catch (error) {
      handleError(error as Error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getCustomer = async (id: string) => {
    try {
      setIsLoading(true)
      return await customerService.getById(id)
    } catch (error) {
      handleError(error as Error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const searchCustomers = async (query: string) => {
    try {
      setIsLoading(true)
      return await customerService.search(query)
    } catch (error) {
      handleError(error as Error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
    searchCustomers,
    customerService
  }
}