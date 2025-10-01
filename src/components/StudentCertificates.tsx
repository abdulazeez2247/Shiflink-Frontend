
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Eye, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Certificate {
  id: string;
  certificate_number: string;
  certificate_type: string;
  issue_date: string;
  expiry_date: string | null;
  verification_code: string;
  file_url: string | null;
  is_valid: boolean;
  course: {
    title: string;
  } | null;
}

const StudentCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      console.log('Fetching certificates for user:', user?.id);

      const { data, error } = await supabase
        .from('certificates')
        .select(`
          id,
          certificate_number,
          certificate_type,
          issue_date,
          expiry_date,
          verification_code,
          file_url,
          is_valid,
          courses (
            title
          )
        `)
        .eq('student_id', user?.id)
        .order('issue_date', { ascending: false });

      if (error) throw error;

      const transformedCertificates = data?.map(cert => ({
        ...cert,
        course: cert.courses ? { title: cert.courses.title } : null
      })) || [];

      setCertificates(transformedCertificates);
      console.log('Certificates loaded:', transformedCertificates);

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

  const handleDownload = (certificate: Certificate) => {
    if (certificate.file_url) {
      window.open(certificate.file_url, '_blank');
    } else {
      toast({
        title: "Not Available",
        description: "Certificate file is not available for download",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="w-5 h-5" />
          <span>My Certificates</span>
        </CardTitle>
        <CardDescription>View and download your earned certificates</CardDescription>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
            <p className="text-gray-500 mb-4">Complete courses to earn your first certificate!</p>
            <Button onClick={() => window.location.href = '/learning'} className="bg-medical-blue hover:bg-blue-800">
              Start Learning
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-lg">{certificate.course?.title || 'Course Certificate'}</h4>
                      <Badge variant={certificate.is_valid ? "default" : "destructive"}>
                        {certificate.is_valid ? "Valid" : "Invalid"}
                      </Badge>
                      {certificate.expiry_date && isExpired(certificate.expiry_date) && (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Certificate #:</span> {certificate.certificate_number}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {certificate.certificate_type}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Issued:</span> {formatDate(certificate.issue_date)}
                      </div>
                      {certificate.expiry_date && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">Expires:</span> {formatDate(certificate.expiry_date)}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Verification Code:</span> {certificate.verification_code}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(certificate)}
                      disabled={!certificate.file_url}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentCertificates;
