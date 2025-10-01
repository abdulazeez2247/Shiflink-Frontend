
import type { Tables } from '@/integrations/supabase/types';

export type UploadedCertificate = Tables<'uploaded_certificates'>;

export interface CertificateUploadFormProps {
  onUploadSuccess: () => void;
}

export interface CertificateListProps {
  certificates: UploadedCertificate[];
  onDelete: (certificateId: string) => void;
  onDownload: (certificate: UploadedCertificate) => void;
}

export interface CertificateItemProps {
  certificate: UploadedCertificate;
  onDelete: (certificateId: string) => void;
  onDownload: (certificate: UploadedCertificate) => void;
}
