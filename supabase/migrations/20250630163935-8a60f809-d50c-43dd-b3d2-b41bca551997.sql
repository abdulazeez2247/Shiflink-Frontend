
-- Create transportation companies table
CREATE TABLE public.transportation_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  city TEXT NOT NULL DEFAULT 'Ohio',
  state TEXT NOT NULL DEFAULT 'OH',
  zip_code TEXT,
  license_number TEXT,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  insurance_expiry_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 15.00, -- Platform commission percentage
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_rides INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create drivers table
CREATE TABLE public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transportation_company_id UUID REFERENCES public.transportation_companies(id) ON DELETE CASCADE,
  driver_name TEXT NOT NULL,
  driver_email TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  license_number TEXT NOT NULL,
  license_expiry_date DATE NOT NULL,
  background_check_status TEXT NOT NULL DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'approved', 'rejected')),
  background_check_date DATE,
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  vehicle_license_plate TEXT,
  vehicle_insurance_policy TEXT,
  vehicle_insurance_expiry DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_rides INTEGER DEFAULT 0,
  current_location_lat DECIMAL(10, 8),
  current_location_lng DECIMAL(11, 8),
  is_available BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ride requests table
CREATE TABLE public.ride_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL, -- DSP who needs transportation
  shift_id TEXT, -- Reference to the shift they're going to/from
  pickup_address TEXT NOT NULL,
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  destination_address TEXT NOT NULL,
  destination_lat DECIMAL(10, 8),
  destination_lng DECIMAL(11, 8),
  ride_type TEXT NOT NULL CHECK (ride_type IN ('to_shift', 'from_shift', 'agency_client')),
  requested_pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  estimated_duration_minutes INTEGER,
  estimated_distance_miles DECIMAL(5,2),
  base_fare DECIMAL(8,2),
  platform_fee DECIMAL(8,2),
  total_fare DECIMAL(8,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  special_requirements TEXT,
  passenger_count INTEGER DEFAULT 1,
  assigned_driver_id UUID REFERENCES public.drivers(id),
  accepted_at TIMESTAMP WITH TIME ZONE,
  pickup_completed_at TIMESTAMP WITH TIME ZONE,
  dropoff_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agency transportation requests table (for agencies needing services for their clients)
CREATE TABLE public.agency_transportation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL, -- Reference to agency profile
  client_name TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  requested_pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  recurring_schedule JSONB, -- For recurring rides (days of week, times, etc.)
  special_needs TEXT,
  wheelchair_accessible BOOLEAN DEFAULT false,
  passenger_count INTEGER DEFAULT 1,
  estimated_fare DECIMAL(8,2),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'quoted', 'assigned', 'completed', 'cancelled')),
  assigned_transportation_company_id UUID REFERENCES public.transportation_companies(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ride ratings table
CREATE TABLE public.ride_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_request_id UUID REFERENCES public.ride_requests(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL, -- Who gave the rating (DSP or driver)
  rater_type TEXT NOT NULL CHECK (rater_type IN ('passenger', 'driver')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transportation quotes table (for agency requests)
CREATE TABLE public.transportation_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_request_id UUID REFERENCES public.agency_transportation_requests(id) ON DELETE CASCADE,
  transportation_company_id UUID REFERENCES public.transportation_companies(id) ON DELETE CASCADE,
  quoted_price DECIMAL(8,2) NOT NULL,
  service_details TEXT,
  estimated_duration TEXT,
  availability_notes TEXT,
  quote_valid_until DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all transportation tables
ALTER TABLE public.transportation_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_transportation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportation_quotes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for transportation companies
CREATE POLICY "Transportation companies can view their own data" 
  ON public.transportation_companies 
  FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE email = contact_email));

CREATE POLICY "Public can view active transportation companies" 
  ON public.transportation_companies 
  FOR SELECT 
  USING (is_active = true);

-- Create RLS policies for drivers
CREATE POLICY "Drivers can view their own data" 
  ON public.drivers 
  FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE email = driver_email));

CREATE POLICY "Transportation companies can manage their drivers" 
  ON public.drivers 
  FOR ALL 
  USING (transportation_company_id IN (
    SELECT id FROM public.transportation_companies 
    WHERE auth.uid() IN (SELECT id FROM public.profiles WHERE email = contact_email)
  ));

CREATE POLICY "Public can view active drivers for ride matching" 
  ON public.drivers 
  FOR SELECT 
  USING (is_active = true AND background_check_status = 'approved');

-- Create RLS policies for ride requests
CREATE POLICY "Users can manage their own ride requests" 
  ON public.ride_requests 
  FOR ALL 
  USING (requester_id = auth.uid());

CREATE POLICY "Drivers can view assigned rides" 
  ON public.ride_requests 
  FOR SELECT 
  USING (assigned_driver_id IN (
    SELECT id FROM public.drivers 
    WHERE auth.uid() IN (SELECT id FROM public.profiles WHERE email = driver_email)
  ));

-- Create RLS policies for agency transportation requests
CREATE POLICY "Agencies can manage their transportation requests" 
  ON public.agency_transportation_requests 
  FOR ALL 
  USING (agency_id = auth.uid());

CREATE POLICY "Transportation companies can view open requests" 
  ON public.agency_transportation_requests 
  FOR SELECT 
  USING (status IN ('open', 'quoted'));

-- Create RLS policies for ride ratings
CREATE POLICY "Users can manage their own ratings" 
  ON public.ride_ratings 
  FOR ALL 
  USING (rater_id = auth.uid());

-- Create RLS policies for transportation quotes
CREATE POLICY "Transportation companies can manage their quotes" 
  ON public.transportation_quotes 
  FOR ALL 
  USING (transportation_company_id IN (
    SELECT id FROM public.transportation_companies 
    WHERE auth.uid() IN (SELECT id FROM public.profiles WHERE email = contact_email)
  ));

CREATE POLICY "Agencies can view quotes for their requests" 
  ON public.transportation_quotes 
  FOR SELECT 
  USING (agency_request_id IN (
    SELECT id FROM public.agency_transportation_requests 
    WHERE agency_id = auth.uid()
  ));

-- Create indexes for performance
CREATE INDEX idx_drivers_company ON public.drivers(transportation_company_id);
CREATE INDEX idx_drivers_location ON public.drivers(current_location_lat, current_location_lng);
CREATE INDEX idx_drivers_available ON public.drivers(is_available, is_active);
CREATE INDEX idx_ride_requests_status ON public.ride_requests(status);
CREATE INDEX idx_ride_requests_driver ON public.ride_requests(assigned_driver_id);
CREATE INDEX idx_ride_requests_time ON public.ride_requests(requested_pickup_time);
CREATE INDEX idx_agency_requests_status ON public.agency_transportation_requests(status);
CREATE INDEX idx_quotes_request ON public.transportation_quotes(agency_request_id);
