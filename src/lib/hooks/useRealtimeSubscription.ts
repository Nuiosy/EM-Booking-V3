import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

export function useRealtimeSubscription(table: string, onUpdate: () => void) {
  const { toast } = useToast()

  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        (payload) => {
          console.log('Change received!', payload)
          onUpdate()
          
          toast({
            title: 'Data Updated',
            description: `${table} has been updated successfully.`
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, onUpdate, toast])
}