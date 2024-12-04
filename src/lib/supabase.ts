import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
})

// Create a single channel for all table changes
const channel = supabase.channel('db-changes')

// Subscribe to customers table changes
channel.on(
  'postgres_changes',
  { event: '*', schema: 'public', table: 'customers' },
  (payload) => {
    console.log('Customer change received:', payload)
  }
)

// Subscribe to bookings table changes
channel.on(
  'postgres_changes',
  { event: '*', schema: 'public', table: 'bookings' },
  (payload) => {
    console.log('Booking change received:', payload)
  }
)

// Subscribe to the channel
channel.subscribe((status) => {
  if (status === 'SUBSCRIBED') {
    console.log('Connected to Supabase real-time')
  } else if (status === 'CLOSED') {
    console.log('Disconnected from Supabase real-time')
  } else if (status === 'CHANNEL_ERROR') {
    console.error('Supabase real-time connection error')
  }
})

// Export cleanup function
export const closeSupabaseConnection = () => {
  supabase.removeChannel(channel)
}