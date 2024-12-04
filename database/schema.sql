-- Add booking_flights table
CREATE TABLE booking_flights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    date DATE NOT NULL,
    from_code TEXT NOT NULL,
    from_name TEXT NOT NULL,
    from_time TEXT NOT NULL,
    to_code TEXT NOT NULL,
    to_name TEXT NOT NULL,
    to_time TEXT NOT NULL,
    carrier TEXT NOT NULL,
    flight_number TEXT NOT NULL,
    duration TEXT NOT NULL,
    baggage TEXT NOT NULL,
    arrival_date DATE NOT NULL,
    organizer TEXT NOT NULL,
    travel_reason TEXT,
    travel_status TEXT,
    processing_status TEXT,
    comments TEXT,
    
    -- Option details
    option_date DATE,
    option_price DECIMAL(10,2),
    option_expiry DATE,
    
    pnr TEXT,
    price DECIMAL(10,2)
);

-- Add trigger for updated_at
CREATE TRIGGER update_booking_flights_updated_at
    BEFORE UPDATE ON booking_flights
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE booking_flights ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Enable CRUD for authenticated users"
ON booking_flights FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create index
CREATE INDEX idx_booking_flights_booking_id ON booking_flights(booking_id);