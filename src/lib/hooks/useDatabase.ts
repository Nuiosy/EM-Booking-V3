import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

export function useDatabase() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const resetDatabase = async () => {
    try {
      setIsLoading(true)
      
      // Delete all data from tables in reverse order of dependencies
      const tables = [
        'chat_messages',
        'chat_participants',
        'chat_conversations',
        'notes',
        'bookings',
        'customers'
      ]

      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', '')

        if (error) throw error
      }

      toast({
        title: "Success",
        description: "Database has been reset successfully"
      })
      return true
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    resetDatabase
  }
}