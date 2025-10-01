
import { Card, CardContent } from '@/components/ui/card';
import { useCertificates } from '@/hooks/useCertificates';
import CertificateUploadForm from './certificates/CertificateUploadForm';
import CertificateList from './certificates/CertificateList';

const CertificateUpload = () => {
  const {
    certificates,
    loading,
    fetchCertificates,
    deleteCertificate,
    downloadCertificate
  } = useCertificates();

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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Certificate Management</h3>
        <p className="text-gray-600">Upload and manage your professional certificates and credentials</p>
      </div>

      <CertificateUploadForm onUploadSuccess={fetchCertificates} />
      
      <CertificateList 
        certificates={certificates}
        onDelete={deleteCertificate}
        onDownload={downloadCertificate}
      />
    </div>
  );
};

export default CertificateUpload;
