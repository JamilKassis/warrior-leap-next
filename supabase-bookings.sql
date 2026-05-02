-- ============================================================
-- Bookings table for Warrior Leap Ice Bath Rental
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_number TEXT UNIQUE,

  -- Customer
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Event details
  event_date DATE NOT NULL,
  event_time TEXT,
  duration_hours NUMERIC(4, 1),
  guest_count INTEGER,

  -- Package & service
  package_type TEXT NOT NULL CHECK (package_type IN ('home', 'corporate', 'gym', 'event', 'retreat', 'content')),
  service_level TEXT NOT NULL CHECK (service_level IN ('drop_off', 'attended', 'coached')),

  -- Location
  location_zone TEXT NOT NULL CHECK (location_zone IN ('beirut', 'mount_lebanon', 'north', 'south', 'bekaa')),
  location_address TEXT NOT NULL,

  -- Add-ons (array of slugs)
  addons JSONB DEFAULT '[]'::jsonb,

  -- Pricing & status
  estimated_total NUMERIC(12, 2),
  deposit_paid NUMERIC(12, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),

  -- Notes
  notes TEXT,
  admin_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings (event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_package_type ON bookings (package_type);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);

-- Auto-generate booking_number on insert (BK-YYYYMMDD-XXXX)
CREATE OR REPLACE FUNCTION set_booking_number()
RETURNS TRIGGER AS $$
DECLARE
  next_seq INTEGER;
BEGIN
  IF NEW.booking_number IS NULL THEN
    SELECT COALESCE(MAX(CAST(SPLIT_PART(booking_number, '-', 3) AS INTEGER)), 0) + 1
      INTO next_seq
      FROM bookings
      WHERE booking_number LIKE 'BK-' || TO_CHAR(NEW.created_at, 'YYYYMMDD') || '-%';
    NEW.booking_number := 'BK-' || TO_CHAR(COALESCE(NEW.created_at, NOW()), 'YYYYMMDD') || '-' || LPAD(next_seq::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bookings_set_number
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_number();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();

-- RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public can submit a booking request
CREATE POLICY "Anyone can submit a booking"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated (admins) can read/update/delete
CREATE POLICY "Authenticated users can read bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);
