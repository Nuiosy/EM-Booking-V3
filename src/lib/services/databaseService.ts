import { supabase } from '@/lib/supabase'

export const databaseService = {
  async resetDatabase() {
    try {
      // Drop existing tables
      await supabase.rpc('exec', {
        sql: `
          DROP TABLE IF EXISTS bookings CASCADE;
          DROP TABLE IF EXISTS customers CASCADE;
        `
      })

      // Read and execute schema.sql
      const response = await fetch('/database/schema.sql')
      const schema = await response.text()
      
      // Split schema into individual statements
      const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0)

      // Execute each statement
      for (const statement of statements) {
        const { error } = await supabase.rpc('exec', { sql: statement })
        if (error) {
          console.error('Error executing statement:', error)
          throw error
        }
      }

      return true
    } catch (error) {
      console.error('Error resetting database:', error)
      return false
    }
  },

  async initializeDatabase() {
    try {
      // Read and execute schema.sql
      const response = await fetch('/database/schema.sql')
      const schema = await response.text()
      
      // Split schema into individual statements
      const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0)

      // Execute each statement
      for (const statement of statements) {
        const { error } = await supabase.rpc('exec', { sql: statement })
        if (error) {
          console.error('Error executing statement:', error)
          throw error
        }
      }

      return true
    } catch (error) {
      console.error('Error initializing database:', error)
      return false
    }
  }
}