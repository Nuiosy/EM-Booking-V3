import { supabase } from '@/lib/supabase'

export async function clearDatabase() {
  try {
    // Delete in reverse order of dependencies
    await supabase.from('booking_payments').delete().neq('id', '')
    await supabase.from('booking_flights').delete().neq('id', '')
    await supabase.from('booking_hotels').delete().neq('id', '')
    await supabase.from('bookings').delete().neq('id', '')
    await supabase.from('customers').delete().neq('id', '')
    await supabase.from('notes').delete().neq('id', '')
    
    console.log('Database cleared successfully')
    return true
  } catch (error) {
    console.error('Error clearing database:', error)
    return false
  }
}

export async function createTestData() {
  try {
    // Create test customer
    const { data: customer } = await supabase
      .from('customers')
      .insert({
        salutation: 'Dr.',
        first_name: 'Thomas',
        last_name: 'Schmidt',
        email: 't.schmidt@example.com',
        phone: '+49 123 456789',
        mobile: '+49 987 654321',
        customer_type: 'private',
        customer_number: 'C123456',
        address: 'Hauptstraße 1',
        postal_code: '80331',
        city: 'München',
        country: 'Germany'
      })
      .select()
      .single()

    if (!customer) throw new Error('Failed to create test customer')

    // Create test booking
    const { data: booking } = await supabase
      .from('bookings')
      .insert({
        booking_number: '24000001',
        customer_id: customer.id,
        start_date: '2024-02-15',
        status: 'draft',
        total_amount: 1200.00,
        paid_amount: 0,
        travel_type: 'EU Flight'
      })
      .select()
      .single()

    if (!booking) throw new Error('Failed to create test booking')

    // Add test flight
    await supabase
      .from('booking_flights')
      .insert({
        booking_id: booking.id,
        date: '2024-02-15',
        from_code: 'MUC',
        from_name: 'Munich',
        from_time: '10:30',
        to_code: 'BCN',
        to_name: 'Barcelona',
        to_time: '12:45',
        carrier: 'Lufthansa',
        flight_number: 'LH1806',
        duration: '2h 15m',
        baggage: '23',
        arrival_date: '2024-02-15',
        organizer: 'TUI',
        travel_reason: 'Business',
        travel_status: 'Confirmed',
        processing_status: 'Completed',
        option_date: '2024-02-10',
        option_price: 299.99,
        option_expiry: '2024-02-15',
        pnr: 'ABC123',
        price: 1200.00
      })

    // Add test payment
    await supabase
      .from('booking_payments')
      .insert({
        booking_id: booking.id,
        date: '2024-02-10',
        amount: 800.00,
        method: 'Credit Card',
        reference: 'TX-123456',
        status: 'completed',
        notes: 'Initial payment'
      })

    console.log('Test data created successfully')
    return true
  } catch (error) {
    console.error('Error creating test data:', error)
    return false
  }
}