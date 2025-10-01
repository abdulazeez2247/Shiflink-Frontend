import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Flag, AlertTriangle, Eye, Search, Filter, Users, Clock, Mail, Calendar, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DSPApplication {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: string;
  skills: string[];
  certifications: string[];
  applicationStatus: 'pending' | 'approved' | 'confirmed' | 'completed' | 'cancelled';
  applicationDate: string;
  createdAt: string;
  // Since 'flagged' is not in your Booking model, we'll track it separately
  isFlagged?: boolean;
  flagReason?: string;
  // Add shift information that comes from your backend
  shiftTitle?: string;
  shiftDate?: string;
  shiftLocation?: string;
  shiftRate?: number;
}

interface DSPApprovalManagerProps {
  applications: DSPApplication[];
  onUpdateApplication: (applicationId: string, status: string, notes?: string) => Promise<void>;
}

const DSPApprovalManager = ({ applications = [], onUpdateApplication }: DSPApprovalManagerProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<DSPApplication | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadge = (status: string, isFlagged?: boolean) => {
    // Show flagged badge first if application is flagged (using notes or separate field)
    if (isFlagged) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Flag className="w-3 h-3" />
          Flagged
        </Badge>
      );
    }
    
    // Regular status badges based on your Booking model enum
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Approved
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge className="bg-blue-500 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Confirmed
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-purple-500 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Ban className="w-3 h-3" />
            Cancelled
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge className="bg-yellow-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Review
          </Badge>
        );
    }
  };

  // Helper to check if an application is flagged (using notes or isFlagged field)
const isApplicationFlagged = (application: DSPApplication): boolean => {
  // For now, we'll consider 'cancelled' applications as flagged
  // You can enhance this later when you add proper flagging to your backend
  return application.applicationStatus === 'cancelled';
};

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isFlagged = isApplicationFlagged(app);
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'flagged') return matchesSearch && isFlagged;
    return matchesSearch && app.applicationStatus === statusFilter;
  });

  const handleStatusUpdate = async (applicationId: string, newStatus: string, notes: string = '') => {
    setIsLoading(true);
    try {
      await onUpdateApplication(applicationId, newStatus, notes);
      
      const application = applications.find(app => app._id === applicationId);
      toast({
        title: `DSP ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        description: `${application?.firstName} ${application?.lastName} has been ${newStatus} successfully.`,
        className: newStatus === 'approved' ? "bg-green-50 border-green-200" : 
                   newStatus === 'cancelled' ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSelectedApplication(null);
      setShowFlagDialog(false);
      setFlagReason('');
    }
  };

  // Handle flagging - we'll use 'cancelled' status with a flag reason
  const handleFlagApplication = async (applicationId: string, reason: string) => {
    await handleStatusUpdate(applicationId, 'cancelled', `FLAGGED: ${reason}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stats = {
    total: applications.length,
    approved: applications.filter(app => app.applicationStatus === 'approved').length,
    pending: applications.filter(app => app.applicationStatus === 'pending').length,
    confirmed: applications.filter(app => app.applicationStatus === 'confirmed').length,
    completed: applications.filter(app => app.applicationStatus === 'completed').length,
    flagged: applications.filter(app => isApplicationFlagged(app)).length
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total DSPs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
              </div>
              <Flag className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DSP Management */}
      <Card>
        <CardHeader>
          <CardTitle>DSP Approval & Management</CardTitle>
          <CardDescription>Review, approve, and manage DSP applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
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
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* DSPs Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center">
                        <Users className="w-12 h-12 text-gray-300 mb-2" />
                        <p>No DSP applications found</p>
                        <p className="text-sm">Applications will appear here when DSPs apply to your agency</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((application) => (
                    <TableRow key={application._id}>
                      <TableCell>
                        {getStatusBadge(application.applicationStatus, isApplicationFlagged(application))}
                      </TableCell>
                      <TableCell className="font-medium">
                        {application.firstName} {application.lastName}
                        {application.shiftTitle && (
                          <p className="text-xs text-gray-500 mt-1">{application.shiftTitle}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {application.email}
                        </div>
                      </TableCell>
                      <TableCell>{application.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(application.applicationDate || application.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {application.experience || 'Not specified'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedApplication(application)}
                                disabled={isLoading}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>DSP Application Details</DialogTitle>
                                <DialogDescription>
                                  Review application for {selectedApplication?.firstName} {selectedApplication?.lastName}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedApplication && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Name</label>
                                      <p className="text-sm text-gray-600">
                                        {selectedApplication.firstName} {selectedApplication.lastName}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Email</label>
                                      <p className="text-sm text-gray-600">{selectedApplication.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Phone</label>
                                      <p className="text-sm text-gray-600">{selectedApplication.phone}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Experience</label>
                                      <p className="text-sm text-gray-600">{selectedApplication.experience || 'Not specified'}</p>
                                    </div>
                                    {selectedApplication.shiftTitle && (
                                      <>
                                        <div>
                                          <label className="text-sm font-medium">Shift</label>
                                          <p className="text-sm text-gray-600">{selectedApplication.shiftTitle}</p>
                                        </div>
                                        <div>
                                          <label className="text-sm font-medium">Location</label>
                                          <p className="text-sm text-gray-600">{selectedApplication.shiftLocation}</p>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  
                                  {selectedApplication.skills && selectedApplication.skills.length > 0 && (
                                    <div>
                                      <label className="text-sm font-medium">Skills</label>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {selectedApplication.skills.map((skill: string, index: number) => (
                                          <Badge key={index} variant="outline">{skill}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {selectedApplication.certifications && selectedApplication.certifications.length > 0 && (
                                    <div>
                                      <label className="text-sm font-medium">Certifications</label>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {selectedApplication.certifications.map((cert: string, index: number) => (
                                          <Badge key={index} variant="outline">{cert}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex gap-2 pt-4">
                                    {selectedApplication.applicationStatus !== 'approved' && (
                                      <Button 
                                        onClick={() => handleStatusUpdate(selectedApplication._id, 'approved')}
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={isLoading}
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                      </Button>
                                    )}
                                    {selectedApplication.applicationStatus !== 'confirmed' && selectedApplication.applicationStatus === 'approved' && (
                                      <Button 
                                        onClick={() => handleStatusUpdate(selectedApplication._id, 'confirmed')}
                                        className="bg-blue-600 hover:bg-blue-700"
                                        disabled={isLoading}
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Confirm
                                      </Button>
                                    )}
                                    <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" disabled={isLoading}>
                                          <Flag className="w-4 h-4 mr-2" />
                                          Flag
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Flag DSP Application</DialogTitle>
                                          <DialogDescription>
                                            Provide a reason for flagging {selectedApplication.firstName}'s application
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <div>
                                            <label className="text-sm font-medium">Flag Reason</label>
                                            <Textarea
                                              placeholder="Enter reason for flagging this application..."
                                              value={flagReason}
                                              onChange={(e) => setFlagReason(e.target.value)}
                                              rows={3}
                                            />
                                          </div>
                                          <div className="flex justify-end gap-2">
                                            <Button 
                                              variant="outline" 
                                              onClick={() => {
                                                setShowFlagDialog(false);
                                                setFlagReason('');
                                              }}
                                              disabled={isLoading}
                                            >
                                              Cancel
                                            </Button>
                                            <Button 
                                              variant="destructive"
                                              onClick={() => handleFlagApplication(selectedApplication._id, flagReason)}
                                              disabled={isLoading || !flagReason.trim()}
                                            >
                                              Flag Application
                                            </Button>
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DSPApprovalManager;