import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

export function useSupabase() {
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('count')
          .limit(1)
          .single()

        if (error) {
          console.error('Supabase connection error:', error)
          throw error
        }
        
        setIsConnected(true)
        console.log('Successfully connected to Supabase')
      } catch (err) {
        console.error('Failed to connect to Supabase:', err)
        setIsConnected(false)
        toast({
          title: "Database Connection Error",
          description: "Failed to connect to the database. Please check your configuration.",
          variant: "destructive"
        })
      }
    }

    // Check connection immediately and then every 30 seconds
    checkConnection()
    const interval = setInterval(checkConnection, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [toast])

  return {
    isConnected,
    supabase
  }
}