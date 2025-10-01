
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, Clock, Search, Download, Filter } from 'lucide-react';

const CredentialReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const credentials = [
    {
      id: 1,
      dspName: 'Sarah Johnson',
      facility: 'Sunrise Care',
      certificateType: 'CPR/First Aid',
      issueDate: '2024-01-15',
      expirationDate: '2024-07-15',
      status: 'expiring_soon',
      daysUntilExpiry: 12
    },
    {
      id: 2,
      dspName: 'Michael Chen',
      facility: 'Valley View',
      certificateType: 'Medication Administration',
      issueDate: '2023-11-20',
      expirationDate: '2024-11-20',
      status: 'valid',
      daysUntilExpiry: 178
    },
    {
      id: 3,
      dspName: 'Emily Rodriguez',
      facility: 'Maple Heights',
      certificateType: 'Crisis Intervention',
      issueDate: '2023-12-10',
      expirationDate: '2024-05-15',
      status: 'expired',
      daysUntilExpiry: -20
    },
    {
      id: 4,
      dspName: 'David Wilson',
      facility: 'Riverside Manor',
      certificateType: 'Basic DSP Training',
      issueDate: '2024-02-01',
      expirationDate: '2025-02-01',
      status: 'valid',
      daysUntilExpiry: 245
    },
    {
      id: 5,
      dspName: 'Lisa Thompson',
      facility: 'Oakwood Center',
      certificateType: 'Behavioral Support',
      issueDate: '2023-10-05',
      expirationDate: '2024-06-10',
      status: 'expiring_soon',
      daysUntilExpiry: 8
    }
  ];

  const getStatusBadge = (status: string, daysUntilExpiry: number) => {
    if (status === 'expired') {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (status === 'expiring_soon' || daysUntilExpiry <= 30) {
      return <Badge className="bg-orange-500">Expiring Soon</Badge>;
    }
    return <Badge className="bg-green-500">Valid</Badge>;
  };

  const getStatusIcon = (status: string, daysUntilExpiry: number) => {
    if (status === 'expired') {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    if (status === 'expiring_soon' || daysUntilExpiry <= 30) {
      return <Clock className="w-4 h-4 text-orange-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const filteredCredentials = credentials.filter(credential => {
    const matchesSearch = credential.dspName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credential.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credential.certificateType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'expired') return matchesSearch && credential.status === 'expired';
    if (statusFilter === 'expiring') return matchesSearch && (credential.status === 'expiring_soon' || credential.daysUntilExpiry <= 30);
    if (statusFilter === 'valid') return matchesSearch && credential.status === 'valid' && credential.daysUntilExpiry > 30;
    
    return matchesSearch;
  });

  const stats = {
    total: credentials.length,
    expired: credentials.filter(c => c.status === 'expired').length,
    expiringSoon: credentials.filter(c => c.status === 'expiring_soon' || c.daysUntilExpiry <= 30).length,
    valid: credentials.filter(c => c.status === 'valid' && c.daysUntilExpiry > 30).length
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Credentials</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valid</p>
                <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Credential Management</CardTitle>
          <CardDescription>Track and manage DSP certifications and credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by DSP name, facility, or certificate type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Credentials Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>DSP Name</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Certificate Type</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Days Until Expiry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCredentials.map((credential) => (
                  <TableRow key={credential.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(credential.status, credential.daysUntilExpiry)}
                        {getStatusBadge(credential.status, credential.daysUntilExpiry)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{credential.dspName}</TableCell>
                    <TableCell>{credential.facility}</TableCell>
                    <TableCell>{credential.certificateType}</TableCell>
                    <TableCell>{credential.issueDate}</TableCell>
                    <TableCell>{credential.expirationDate}</TableCell>
                    <TableCell>
                      <span className={
                        credential.daysUntilExpiry < 0 ? 'text-red-600 font-medium' :
                        credential.daysUntilExpiry <= 30 ? 'text-orange-600 font-medium' :
                        'text-gray-600'
                      }>
                        {credential.daysUntilExpiry < 0 
                          ? `${Math.abs(credential.daysUntilExpiry)} days overdue`
                          : `${credential.daysUntilExpiry} days`
                        }
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CredentialReports;
