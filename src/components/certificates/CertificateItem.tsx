
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, X, Download, Calendar, FileText } from 'lucide-react';
import type { CertificateItemProps } from './types';

const CertificateItem = ({ certificate, onDelete, onDownload }: CertificateItemProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        {getStatusIcon(certificate.status)}
        <div>
          <h4 className="font-medium">{certificate.certificate_name}</h4>
          <p className="text-sm text-gray-600">Type: {certificate.certificate_type}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Uploaded: {formatDate(certificate.upload_date)}</span>
            </div>
            {certificate.expiry_date && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Expires: {formatDate(certificate.expiry_date)}</span>
              </div>
            )}
          </div>
          {certificate.status === 'rejected' && certificate.rejection_reason && (
            <p className="text-sm text-red-600 mt-1">
              Reason: {certificate.rejection_reason}
            </p>
          )}
          {certificate.verified_at && (
            <p className="text-xs text-green-600 mt-1">
              Verified on {formatDate(certificate.verified_at)}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {getStatusBadge(certificate.status)}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDownload(certificate)}
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDelete(certificate.id)}
        >
          <X className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default CertificateItem;
