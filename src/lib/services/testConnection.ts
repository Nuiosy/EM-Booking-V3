import { supabase } from '@/lib/supabase'

export async function testDatabaseConnection() {
  try {
    // Test customer creation
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert({
        customer_type: 'private',
        salutation: 'Mr.',
        first_name: 'Test',
        last_name: 'User',
        customer_number: 'TEST001',
        customer_since: new Date().toISOString()
      })
      .select()
      .single()

    if (customerError) throw customerError

    // Test booking creation
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        booking_number: 'B-TEST001',
        customer_id: customer.id,
        start_date: new Date().toISOString(),
        status: 'draft',
        total_amount: 0,
        paid_amount: 0
      })
      .select()
      .single()

    if (bookingError) throw bookingError

    // Clean up test data
    await supabase.from('bookings').delete().eq('id', booking.id)
    await supabase.from('customers').delete().eq('id', customer.id)

    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}