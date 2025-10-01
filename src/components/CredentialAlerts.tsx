import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, Calendar, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Credential {
  id: string;
  name: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
  daysUntilExpiry: number;
  reminderSent: boolean;
}

const CredentialAlerts = () => {
  const { toast } = useToast();
  
  const [credentials, setCredentials] = useState<Credential[]>([
    {
      id: '1',
      name: 'CPR Certification',
      expiryDate: '2024-12-15',
      status: 'valid',
      daysUntilExpiry: 195,
      reminderSent: false
    },
    {
      id: '2',
      name: 'First Aid Certification',
      expiryDate: '2024-07-20',
      status: 'expiring',
      daysUntilExpiry: 47,
      reminderSent: true
    },
    {
      id: '3',
      name: 'Background Check',
      expiryDate: '2024-05-01',
      status: 'expired',
      daysUntilExpiry: -33,
      reminderSent: true
    },
    {
      id: '4',
      name: 'Medication Administration',
      expiryDate: '2024-08-30',
      status: 'expiring',
      daysUntilExpiry: 88,
      reminderSent: false
    }
  ]);

  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    // Check for credential alerts
    const newAlerts: string[] = [];
    
    credentials.forEach(credential => {
      if (credential.status === 'expired') {
        newAlerts.push(`${credential.name} has expired and needs immediate renewal`);
      } else if (credential.status === 'expiring' && credential.daysUntilExpiry <= 30) {
        newAlerts.push(`${credential.name} expires in ${credential.daysUntilExpiry} days`);
      }
    });

    setAlerts(newAlerts);
  }, [credentials]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expiring':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'expired':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800">Valid</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return null;
    }
  };

  const handleRenewCredential = (credentialId: string) => {
    console.log('Renewing credential:', credentialId);
    toast({
      title: "Renewal Process Started",
      description: "You will be redirected to the credential renewal portal.",
    });
  };

  const handleUploadNewCertificate = () => {
    console.log('Upload new certificate clicked');
    toast({
      title: "Upload Certificate",
      description: "Opening certificate upload form...",
    });
    // In a real app, this would open a file upload dialog or navigate to upload page
  };

  const handleScheduleRenewal = () => {
    console.log('Schedule renewal clicked');
    toast({
      title: "Schedule Renewal",
      description: "Opening renewal scheduling system...",
    });
    // In a real app, this would open a calendar/scheduling interface
  };

  const handleVerifyAllCredentials = () => {
    console.log('Verify all credentials clicked');
    toast({
      title: "Credential Verification",
      description: "Starting verification process for all credentials...",
    });
    // In a real app, this would trigger a verification process
  };

  const urgentCredentials = credentials.filter(c => c.status === 'expired' || (c.status === 'expiring' && c.daysUntilExpiry <= 30));

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      {alerts.length > 0 && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <span>Credential Alerts ({alerts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{alert}</span>
                </div>
              ))}
            </div>
            <Button className="mt-4 bg-red-600 hover:bg-red-700">
              Take Action Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Credential Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Credential Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {credentials.map((credential) => (
              <div key={credential.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(credential.status)}
                    <h4 className="font-medium">{credential.name}</h4>
                  </div>
                  {getStatusBadge(credential.status)}
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Expires: {credential.expiryDate}</p>
                  {credential.status === 'expired' ? (
                    <p className="text-red-600 font-medium">
                      Expired {Math.abs(credential.daysUntilExpiry)} days ago
                    </p>
                  ) : (
                    <p>
                      {credential.daysUntilExpiry} days remaining
                    </p>
                  )}
                </div>

                {(credential.status === 'expired' || credential.status === 'expiring') && (
                  <Button
                    size="sm"
                    className="w-full"
                    variant={credential.status === 'expired' ? 'destructive' : 'outline'}
                    onClick={() => handleRenewCredential(credential.id)}
                  >
                    {credential.status === 'expired' ? 'Renew Now' : 'Renew Early'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={handleUploadNewCertificate}
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Certificate</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={handleScheduleRenewal}
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Renewal</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={handleVerifyAllCredentials}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Verify All Credentials</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CredentialAlerts;
