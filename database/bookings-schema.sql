-- Create booking_flights table
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

-- Create booking_hotels table
CREATE TABLE booking_hotels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    accommodation TEXT NOT NULL,
    meal_plan TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    organizer TEXT NOT NULL,
    
    adults INTEGER NOT NULL DEFAULT 0,
    children INTEGER NOT NULL DEFAULT 0,
    babies INTEGER NOT NULL DEFAULT 0,
    
    net_price DECIMAL(10,2) NOT NULL,
    gross_price DECIMAL(10,2) NOT NULL
);

-- Create booking_hotel_guests table
CREATE TABLE booking_hotel_guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hotel_id UUID NOT NULL REFERENCES booking_hotels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('adult', 'child', 'baby')),
    age INTEGER
);

-- Create booking_participants table
CREATE TABLE booking_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    salutation TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE,
    ticket_number TEXT,
    passport_number TEXT,
    passport_expiry DATE,
    comments TEXT
);

-- Create booking_payments table
CREATE TABLE booking_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method TEXT NOT NULL,
    reference TEXT,
    status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'failed')),
    notes TEXT
);

-- Add triggers for updated_at
CREATE TRIGGER update_booking_flights_updated_at
    BEFORE UPDATE ON booking_flights
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_hotels_updated_at
    BEFORE UPDATE ON booking_hotels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_hotel_guests_updated_at
    BEFORE UPDATE ON booking_hotel_guests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_participants_updated_at
    BEFORE UPDATE ON booking_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_payments_updated_at
    BEFORE UPDATE ON booking_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for booking tables
ALTER TABLE booking_flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_hotel_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for booking tables
CREATE POLICY "Enable CRUD for authenticated users"
ON booking_flights FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable CRUD for authenticated users"
ON booking_hotels FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable CRUD for authenticated users"
ON booking_hotel_guests FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable CRUD for authenticated users"
ON booking_participants FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable CRUD for authenticated users"
ON booking_payments FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes for booking tables
CREATE INDEX idx_booking_flights_booking_id ON booking_flights(booking_id);
CREATE INDEX idx_booking_hotels_booking_id ON booking_hotels(booking_id);
CREATE INDEX idx_booking_hotel_guests_hotel_id ON booking_hotel_guests(hotel_id);
CREATE INDEX idx_booking_participants_booking_id ON booking_participants(booking_id);
CREATE INDEX idx_booking_payments_booking_id ON booking_payments(booking_id);