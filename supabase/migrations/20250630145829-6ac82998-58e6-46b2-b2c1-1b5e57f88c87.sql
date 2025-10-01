
-- Create a table for uploaded certificates (separate from earned certificates)
CREATE TABLE public.uploaded_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  certificate_name TEXT NOT NULL,
  certificate_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.uploaded_certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for uploaded certificates
CREATE POLICY "Students can view their own uploaded certificates" 
  ON public.uploaded_certificates 
  FOR SELECT 
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own uploaded certificates" 
  ON public.uploaded_certificates 
  FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own uploaded certificates" 
  ON public.uploaded_certificates 
  FOR UPDATE 
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all uploaded certificates" 
  ON public.uploaded_certificates 
  FOR SELECT 
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

CREATE POLICY "Admins can update uploaded certificates" 
  ON public.uploaded_certificates 
  FOR UPDATE 
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

-- Create a storage bucket for certificate uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', false);

-- Create storage policies
CREATE POLICY "Users can upload their own certificates"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates' AND auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));
