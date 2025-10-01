
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Building, Award, Clock, CheckCircle, AlertTriangle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CredentialItem {
  id: string;
  name: string;
  type: 'certification' | 'license' | 'training';
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expiring_soon' | 'expired' | 'pending_renewal';
  progress: number;
  attachments: number;
}

interface CredentialDetailsProps {
  credential: CredentialItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (credentialId: string) => void;
  onUploadDocument?: (credentialId: string) => void;
  onRenew?: (credentialId: string) => void;
  onCredentialUpdated?: (credential: CredentialItem) => void;
}

const CredentialDetails = ({ 
  credential, 
  open, 
  onOpenChange, 
  onEdit, 
  onUploadDocument, 
  onRenew,
  onCredentialUpdated
}: CredentialDetailsProps) => {
  const { toast } = useToast();

  if (!credential) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'expiring_soon':
        return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'pending_renewal':
        return <Badge className="bg-blue-100 text-blue-800">Pending Renewal</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expiring_soon':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'expired':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'pending_renewal':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getDaysUntilExpiry = () => {
    const today = new Date();
    const expiryDate = new Date(credential.expiryDate);
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const handleTakeActionNow = () => {
    if (credential.status === 'expired' || credential.status === 'expiring_soon') {
      // Start renewal process
      const updatedCredential = {
        ...credential,
        status: 'pending_renewal' as const,
        progress: 25
      };
      onCredentialUpdated?.(updatedCredential);
      toast({
        title: "Renewal Started",
        description: `Renewal process initiated for ${credential.name}. You'll receive further instructions via email.`
      });
    } else if (credential.progress < 100) {
      // Complete missing requirements
      const updatedCredential = {
        ...credential,
        progress: Math.min(credential.progress + 25, 100)
      };
      onCredentialUpdated?.(updatedCredential);
      toast({
        title: "Progress Updated",
        description: "Credential requirements updated. Keep completing your checklist!"
      });
    }
  };

  const handleRenewNow = () => {
    const updatedCredential = {
      ...credential,
      status: 'pending_renewal' as const,
      progress: 15
    };
    onCredentialUpdated?.(updatedCredential);
    toast({
      title: "Renewal Process Started",
      description: `Standard renewal process initiated for ${credential.name}. Expected completion in 2-3 weeks.`
    });
  };

  const handleRenewEarly = () => {
    const updatedCredential = {
      ...credential,
      status: 'pending_renewal' as const,
      progress: 10
    };
    onCredentialUpdated?.(updatedCredential);
    toast({
      title: "Early Renewal Started",
      description: `Early renewal process initiated for ${credential.name}. This will extend your current expiry date.`
    });
  };

  const daysUntilExpiry = getDaysUntilExpiry();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getStatusIcon(credential.status)}
            <span>{credential.name}</span>
            {getStatusBadge(credential.status)}
          </DialogTitle>
          <DialogDescription>
            Detailed information about this credential
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Urgent Actions */}
          {(credential.status === 'expired' || credential.status === 'expiring_soon' || credential.progress < 100) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Action Required</h4>
              <p className="text-sm text-yellow-700 mb-3">
                {credential.status === 'expired' 
                  ? 'This credential has expired and needs immediate renewal.'
                  : credential.status === 'expiring_soon'
                  ? `This credential expires in ${daysUntilExpiry} days.`
                  : 'Complete remaining requirements to maintain this credential.'}
              </p>
              <Button
                size="sm"
                onClick={handleTakeActionNow}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Take Action Now
              </Button>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Award className="w-4 h-4" />
                <span>Type</span>
              </div>
              <p className="text-sm capitalize">{credential.type.replace('_', ' ')}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Building className="w-4 h-4" />
                <span>Issuing Organization</span>
              </div>
              <p className="text-sm">{credential.issuer}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>Issue Date</span>
              </div>
              <p className="text-sm">{new Date(credential.issueDate).toLocaleDateString()}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>Expiry Date</span>
              </div>
              <p className="text-sm">{new Date(credential.expiryDate).toLocaleDateString()}</p>
              {daysUntilExpiry > 0 && daysUntilExpiry <= 30 && (
                <p className="text-xs text-yellow-600">
                  Expires in {daysUntilExpiry} days
                </p>
              )}
              {daysUntilExpiry <= 0 && (
                <p className="text-xs text-red-600">
                  Expired {Math.abs(daysUntilExpiry)} days ago
                </p>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Completion Status</span>
              <span>{credential.progress}%</span>
            </div>
            <Progress value={credential.progress} className="h-2" />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4" />
              <span>Documents</span>
            </div>
            <p className="text-sm">{credential.attachments} files attached</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(credential.id)}
              className="flex items-center space-x-2"
            >
              <span>Edit Details</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUploadDocument?.(credential.id)}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </Button>

            {credential.status === 'active' && daysUntilExpiry > 30 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRenewEarly}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Renew Early</span>
              </Button>
            )}

            {(credential.status === 'expired' || 
              credential.status === 'expiring_soon') && (
              <Button
                size="sm"
                onClick={handleRenewNow}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Renew Now</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialDetails;
