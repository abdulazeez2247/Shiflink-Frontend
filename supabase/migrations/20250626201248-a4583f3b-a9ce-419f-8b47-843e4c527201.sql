
-- Create courses table for trainers to offer training courses
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  duration_hours INTEGER,
  category TEXT,
  requirements TEXT,
  learning_objectives TEXT[],
  max_students INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course enrollments table to track student purchases
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  amount_paid DECIMAL(10,2),
  certificate_issued BOOLEAN NOT NULL DEFAULT false,
  certificate_issued_at TIMESTAMP WITH TIME ZONE,
  certificate_url TEXT,
  UNIQUE(course_id, student_id)
);

-- Create certificates table to store issued certificates
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  certificate_type TEXT NOT NULL,
  file_url TEXT,
  verification_code TEXT NOT NULL UNIQUE,
  is_valid BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can view active courses" 
  ON public.courses 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Trainers can manage their own courses" 
  ON public.courses 
  FOR ALL 
  USING (auth.uid() = trainer_id);

-- RLS Policies for course enrollments
CREATE POLICY "Students can view their own enrollments" 
  ON public.course_enrollments 
  FOR SELECT 
  USING (auth.uid() = student_id);

CREATE POLICY "Trainers can view enrollments for their courses" 
  ON public.course_enrollments 
  FOR SELECT 
  USING (auth.uid() IN (SELECT trainer_id FROM public.courses WHERE id = course_id));

CREATE POLICY "Students can create their own enrollments" 
  ON public.course_enrollments 
  FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "System can update enrollment status" 
  ON public.course_enrollments 
  FOR UPDATE 
  USING (true);

-- RLS Policies for certificates
CREATE POLICY "Students can view their own certificates" 
  ON public.certificates 
  FOR SELECT 
  USING (auth.uid() = student_id);

CREATE POLICY "Trainers can view certificates they issued" 
  ON public.certificates 
  FOR SELECT 
  USING (auth.uid() = trainer_id);

CREATE POLICY "Trainers can issue certificates for their courses" 
  ON public.certificates 
  FOR INSERT 
  WITH CHECK (auth.uid() = trainer_id);

-- Generate certificate number function
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'CERT-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('certificate_sequence')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for certificate numbers
CREATE SEQUENCE IF NOT EXISTS certificate_sequence START 1;

-- Create verification code generation function
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(md5(random()::text) from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Add triggers to auto-generate certificate numbers and verification codes
CREATE OR REPLACE FUNCTION set_certificate_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.certificate_number IS NULL THEN
    NEW.certificate_number := generate_certificate_number();
  END IF;
  IF NEW.verification_code IS NULL THEN
    NEW.verification_code := generate_verification_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_certificate_defaults_trigger
  BEFORE INSERT ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION set_certificate_defaults();
