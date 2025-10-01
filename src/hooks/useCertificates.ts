
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { UploadedCertificate } from '@/components/certificates/types';

export const useCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<UploadedCertificate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      console.log('Fetching uploaded certificates for user:', user?.id);

      const { data, error } = await supabase
        .from('uploaded_certificates')
        .select('*')
        .eq('student_id', user?.id)
        .order('upload_date', { ascending: false });

      if (error) throw error;

      setCertificates(data || []);
      console.log('Uploaded certificates loaded:', data);

    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast({
        title: "Error",
        description: "Failed to load certificates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificate = async (certificateId: string) => {
    try {
      const { error } = await supabase
        .from('uploaded_certificates')
        .delete()
        .eq('id', certificateId)
        .eq('student_id', user?.id); // Ensure user can only delete their own certificates

      if (error) throw error;

      setCertificates(prev => prev.filter(cert => cert.id !== certificateId));
      
      toast({
        title: "Certificate Deleted",
        description: "The certificate has been removed successfully",
      });

    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the certificate. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadCertificate = (certificate: UploadedCertificate) => {
    window.open(certificate.file_url, '_blank');
  };

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  return {
    certificates,
    loading,
    fetchCertificates,
    deleteCertificate,
    downloadCertificate
  };
};
