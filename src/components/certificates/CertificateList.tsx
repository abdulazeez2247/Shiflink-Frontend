
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import CertificateItem from './CertificateItem';
import type { CertificateListProps } from './types';

const CertificateList = ({ certificates, onDelete, onDownload }: CertificateListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Uploaded Certificates</CardTitle>
        <CardDescription>View and manage your uploaded certificates</CardDescription>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No certificates uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((certificate) => (
              <CertificateItem
                key={certificate.id}
                certificate={certificate}
                onDelete={onDelete}
                onDownload={onDownload}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificateList;
