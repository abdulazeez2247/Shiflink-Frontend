
-- Create table for shift records with EVV compliance
CREATE TABLE public.evv_shifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dsp_id UUID NOT NULL,
  client_id UUID NOT NULL,
  facility_name TEXT NOT NULL,
  shift_date DATE NOT NULL,
  scheduled_start_time TIME NOT NULL,
  scheduled_end_time TIME NOT NULL,
  actual_clock_in_time TIMESTAMP WITH TIME ZONE,
  actual_clock_out_time TIMESTAMP WITH TIME ZONE,
  clock_in_gps_lat DECIMAL(10, 8),
  clock_in_gps_lng DECIMAL(11, 8),
  clock_out_gps_lat DECIMAL(10, 8),
  clock_out_gps_lng DECIMAL(11, 8),
  clock_in_address TEXT,
  clock_out_address TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  medicaid_id TEXT NOT NULL,
  service_type TEXT NOT NULL DEFAULT 'personal_care',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for real-time EVV logs
CREATE TABLE public.evv_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shift_id UUID NOT NULL REFERENCES public.evv_shifts(id) ON DELETE CASCADE,
  dsp_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'clock_in', 'clock_out', 'break_start', 'break_end'
  event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  gps_latitude DECIMAL(10, 8) NOT NULL,
  gps_longitude DECIMAL(11, 8) NOT NULL,
  location_address TEXT,
  device_info JSONB,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for clients
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  medicaid_id TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  phone TEXT,
  emergency_contact TEXT,
  care_notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for evv_shifts
ALTER TABLE public.evv_shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "DSPs can view their own shifts" 
  ON public.evv_shifts 
  FOR SELECT 
  USING (auth.uid() = dsp_id);

CREATE POLICY "DSPs can insert their own shifts" 
  ON public.evv_shifts 
  FOR INSERT 
  WITH CHECK (auth.uid() = dsp_id);

CREATE POLICY "DSPs can update their own shifts" 
  ON public.evv_shifts 
  FOR UPDATE 
  USING (auth.uid() = dsp_id);

-- Add RLS policies for evv_logs
ALTER TABLE public.evv_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "DSPs can view their own logs" 
  ON public.evv_logs 
  FOR SELECT 
  USING (auth.uid() = dsp_id);

CREATE POLICY "DSPs can insert their own logs" 
  ON public.evv_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = dsp_id);

-- Add RLS policies for clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view clients" 
  ON public.clients 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX idx_evv_shifts_dsp_id ON public.evv_shifts(dsp_id);
CREATE INDEX idx_evv_shifts_date ON public.evv_shifts(shift_date);
CREATE INDEX idx_evv_logs_shift_id ON public.evv_logs(shift_id);
CREATE INDEX idx_evv_logs_dsp_id ON public.evv_logs(dsp_id);
CREATE INDEX idx_evv_logs_timestamp ON public.evv_logs(event_timestamp);

-- Insert sample clients
INSERT INTO public.clients (name, medicaid_id, address, phone) VALUES
('Mary Wilson', 'MED-2024-001', '123 Oak Street, Sacramento, CA 95816', '(916) 555-0101'),
('Robert Davis', 'MED-2024-002', '456 Pine Avenue, Sacramento, CA 95817', '(916) 555-0102'),
('Linda Garcia', 'MED-2024-003', '789 Maple Drive, Sacramento, CA 95818', '(916) 555-0103'),
('Patricia Jones', 'MED-2024-004', '321 Cedar Lane, Sacramento, CA 95819', '(916) 555-0104');
