import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle, Clock, AlertTriangle, Plus, Search, Filter, Download, Upload, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CredentialForm from './CredentialForm';
import CredentialDetails from './CredentialDetails';
import CredentialEditForm from './CredentialEditForm';
import DocumentUploadModal from './DocumentUploadModal';

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

const CredentialTracker = () => {
  const { toast } = useToast();
  
  const [credentials, setCredentials] = useState<CredentialItem[]>([
    {
      id: '1',
      name: 'CPR Certification',
      type: 'certification',
      issuer: 'American Red Cross',
      issueDate: '2023-06-15',
      expiryDate: '2024-12-15',
      status: 'active',
      progress: 100,
      attachments: 2
    },
    {
      id: '2',
      name: 'First Aid Certification',
      type: 'certification',
      issuer: 'American Red Cross',
      issueDate: '2023-01-20',
      expiryDate: '2024-07-20',
      status: 'expiring_soon',
      progress: 85,
      attachments: 1
    },
    {
      id: '3',
      name: 'Background Check',
      type: 'license',
      issuer: 'State Department',
      issueDate: '2023-05-01',
      expiryDate: '2024-05-01',
      status: 'expired',
      progress: 0,
      attachments: 3
    },
    {
      id: '4',
      name: 'Medication Administration Training',
      type: 'training',
      issuer: 'Healthcare Training Institute',
      issueDate: '2023-08-30',
      expiryDate: '2024-08-30',
      status: 'pending_renewal',
      progress: 60,
      attachments: 1
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCredentialForm, setShowCredentialForm] = useState(false);
  const [showCredentialDetails, setShowCredentialDetails] = useState(false);
  const [showCredentialEditForm, setShowCredentialEditForm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<CredentialItem | null>(null);

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
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expiring_soon':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'expired':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending_renewal':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleAddCredential = () => {
    console.log('Opening credential form');
    setShowCredentialForm(true);
  };

  const handleCredentialAdded = (newCredential: CredentialItem) => {
    setCredentials(prev => [...prev, newCredential]);
    console.log('New credential added:', newCredential);
  };

  const handleViewCredential = (credentialId: string) => {
    console.log('View credential:', credentialId);
    const credential = credentials.find(c => c.id === credentialId);
    if (credential) {
      setSelectedCredential(credential);
      setShowCredentialDetails(true);
    }
  };

  const handleEditCredential = (credentialId: string) => {
    console.log('Edit credential:', credentialId);
    const credential = credentials.find(c => c.id === credentialId);
    if (credential) {
      setSelectedCredential(credential);
      setShowCredentialEditForm(true);
    }
  };

  const handleCredentialUpdated = (updatedCredential: CredentialItem) => {
    setCredentials(prev => 
      prev.map(c => 
        c.id === updatedCredential.id ? updatedCredential : c
      )
    );
    console.log('Credential updated:', updatedCredential);
  };

  const handleUploadDocument = (credentialId: string) => {
    console.log('Upload document for credential:', credentialId);
    const credential = credentials.find(c => c.id === credentialId);
    if (credential) {
      setSelectedCredential(credential);
      setShowDocumentUpload(true);
    }
  };

  const handleDocumentUploaded = () => {
    if (selectedCredential) {
      setCredentials(prev => 
        prev.map(c => 
          c.id === selectedCredential.id 
            ? { ...c, attachments: c.attachments + 1 }
            : c
        )
      );
    }
  };

  const handleDownloadReport = () => {
    console.log('Export credential report clicked');
    
    // Get filtered credentials for export
    const exportData = filteredCredentials.map(c => ({
      'Credential Name': c.name,
      'Type': c.type.charAt(0).toUpperCase() + c.type.slice(1).replace('_', ' '),
      'Issuer': c.issuer,
      'Issue Date': c.issueDate,
      'Expiry Date': c.expiryDate,
      'Status': c.status.replace('_', ' ').toUpperCase(),
      'Progress': `${c.progress}%`,
      'Attachments': c.attachments,
      'Days Until Expiry': Math.ceil((new Date(c.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    }));

    // Convert to CSV format
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `credential-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Exported ${exportData.length} credentials to CSV file.`,
    });
  };

  const handleRenewCredential = (credentialId: string) => {
    console.log('Renew credential:', credentialId);
    const credential = credentials.find(c => c.id === credentialId);
    if (credential) {
      const updatedCredential = {
        ...credential,
        status: 'pending_renewal' as const,
        progress: Math.max(credential.progress, 25)
      };
      setCredentials(prev => 
        prev.map(c => 
          c.id === credentialId ? updatedCredential : c
        )
      );
      toast({
        title: "Renewal Process Started",
        description: `Renewal initiated for ${credential.name}. You'll receive further instructions via email.`,
      });
    }
  };

  const filteredCredentials = credentials.filter(credential => {
    const matchesSearch = credential.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credential.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || credential.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Credential Tracking</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Track and manage all your professional credentials
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </Button>
              <Button
                size="sm"
                onClick={handleAddCredential}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Credential</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search credentials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending_renewal">Pending Renewal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Credentials List */}
      <div className="grid gap-4">
        {filteredCredentials.map((credential) => (
          <Card key={credential.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Credential Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(credential.status)}
                    <h3 className="font-semibold text-lg">{credential.name}</h3>
                    {getStatusBadge(credential.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Issuer:</span> {credential.issuer}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {credential.type.replace('_', ' ')}
                    </div>
                    <div>
                      <span className="font-medium">Issue Date:</span> {credential.issueDate}
                    </div>
                    <div>
                      <span className="font-medium">Expiry Date:</span> {credential.expiryDate}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Completion Status</span>
                      <span>{credential.progress}%</span>
                    </div>
                    <Progress value={credential.progress} className="h-2" />
                  </div>

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Attachments:</span> {credential.attachments} files
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 lg:w-48">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewCredential(credential.id)}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCredential(credential.id)}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUploadDocument(credential.id)}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Doc</span>
                  </Button>

                  {(credential.status === 'expired' || credential.status === 'expiring_soon' || credential.status === 'pending_renewal') && (
                    <Button
                      size="sm"
                      onClick={() => handleRenewCredential(credential.id)}
                      className="flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Renew</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCredentials.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No credentials found matching your criteria.</p>
            <Button 
              className="mt-4"
              onClick={handleAddCredential}
            >
              Add Your First Credential
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <CredentialForm 
        open={showCredentialForm}
        onOpenChange={setShowCredentialForm}
        onCredentialAdded={handleCredentialAdded}
      />

      <CredentialDetails
        credential={selectedCredential}
        open={showCredentialDetails}
        onOpenChange={setShowCredentialDetails}
        onEdit={handleEditCredential}
        onUploadDocument={handleUploadDocument}
        onRenew={handleRenewCredential}
        onCredentialUpdated={handleCredentialUpdated}
      />

      <CredentialEditForm
        credential={selectedCredential}
        open={showCredentialEditForm}
        onOpenChange={setShowCredentialEditForm}
        onCredentialUpdated={handleCredentialUpdated}
      />

      <DocumentUploadModal
        credentialName={selectedCredential?.name || ''}
        open={showDocumentUpload}
        onOpenChange={setShowDocumentUpload}
        onDocumentUploaded={handleDocumentUploaded}
      />
    </div>
  );
};

export default CredentialTracker;
