import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Calendar, MessageSquare, BarChart3, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ShiftPosting from '@/components/ShiftPosting';
import PostedShiftsList from '@/components/PostedShiftsList';
import OptimizedMessagingSystem from '@/components/messaging/OptimizedMessagingSystem';
import DSPApprovalManager from '@/components/DSPApprovalManager';
import ShiftAnalytics from '@/components/ShiftAnalytics';
import ComplianceReports from '@/components/ComplianceReports';
import { 
  createShift, 
  getAgencyShifts, 
  getAgencyStats, 
  updateShift, 
  deleteShift,
  getDSPApplications,
  getConversations,
  getShiftAnalytics,
  getComplianceReports,
  updateDSPApplication,
  getShiftConversations,
  startShiftConversation,
  startConversation, 
  getActiveDSPs 
} from '@/service/data';

const AgencyDashboard = () => {
  const [stats, setStats] = useState({
    totalShifts: 0,
    activeDSPs: 0,
    pendingApplications: 0,
    thisMonthHours: 0
  });

  const [postedShifts, setPostedShifts] = useState([]);
  const [dspApplications, setDspApplications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [compliance, setCompliance] = useState(null);
  const [showShiftForm, setShowShiftForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({ firstName: 'Agency', agencyName: 'Sunrise Healthcare' });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('shifts');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [activeDSPs, setActiveDSPs] = useState([]); // Add this state

  const { toast } = useToast();

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    fetchAgencyData();
  }, []);

  const mapShiftData = (backendShifts) => {
    return backendShifts.map(shift => ({
      id: shift._id,
      title: shift.title,
      clientName: shift.clientName || 'Unknown Client',
      date: shift.startTime,
      startTime: new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(shift.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: shift.location,
      address: shift.address || shift.location,
      hourlyRate: `$${shift.rate}`,
      shiftType: shift.shiftType || 'Regular',
      requiredCredentials: shift.requirements || [],
      description: shift.description || '',
      specialRequirements: shift.specialRequirements || '',
      status: shift.status === 'open' ? 'active' : 
              shift.status === 'assigned' ? 'filled' : 
              shift.status === 'completed' ? 'completed' : 
              shift.status === 'cancelled' ? 'cancelled' : 'active',
      applicationsCount: shift.applicationsCount || 0,
      createdAt: shift.createdAt,
      assignedDSP: shift.assignedDSP
    }));
  };

  const fetchShiftConversations = async (token: string, shiftIds: string[]) => {
    const conversations = [];
    
    for (const shiftId of shiftIds) {
      try {
        const shiftConvs = await getShiftConversations(token, shiftId);
        conversations.push(...shiftConvs);
      } catch (error) {
        console.error(`Error fetching conversations for shift ${shiftId}:`, error);
      }
    }
    
    return conversations;
  };

  // Add this function to fetch active DSPs
  const fetchActiveDSPs = async () => {
    try {
      const token = getToken();
      if (!token) return [];
      
      const activeDSPsData = await getActiveDSPs(token);
      return activeDSPsData;
    } catch (error) {
      console.error('Error fetching active DSPs:', error);
      return [];
    }
  };

  // Update the handleMessageDSP function to work with any DSP
  const handleMessageDSP = async (dspId: string, shiftId?: string) => {
    try {
      setError('');
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please login again.');
        window.location.href = '/login';
        return;
      }

      let conversation;
      
    if (shiftId) {
      // Start shift-specific conversation
      conversation = await startShiftConversation(token, { shiftId, participantId: dspId });
    } else {
      // Start general conversation
      conversation = await startConversation(token, { participantId: dspId });
    }
    
    setActiveTab('messages');
    setSelectedConversation(conversation._id);
    
    toast({
      title: "Conversation started",
      description: "You can now message the DSP.",
    });
    
    } catch (error) {
      console.error('Error starting conversation:', error);
      setError(error.message || 'Failed to start conversation');
    }
  };

  // Keep the original handleMessageDSP for shift-specific messaging
  const handleMessageDSPFromShift = async (shiftId: string, dspId: string) => {
    await handleMessageDSP(dspId, shiftId);
  };

  const fetchAgencyData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = getToken();
      
      if (!token) {
        setError('Authentication required. Please login again.');
        window.location.href = '/login';
        return;
      }

      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      const [statsData, shiftsData, applicationsData, analyticsData, complianceData, activeDSPsData] = await Promise.all([
        getAgencyStats(token),
        getAgencyShifts(token, 1, 100),
        getDSPApplications(token),
        getShiftAnalytics(token),
        getComplianceReports(token),
        fetchActiveDSPs() // Fetch active DSPs
      ]);
      
      setStats(statsData);
      
      const mappedShifts = mapShiftData(shiftsData.shifts || shiftsData);
      setPostedShifts(mappedShifts);
      
      setDspApplications(applicationsData);
      setAnalytics(analyticsData);
      setCompliance(complianceData);
      setActiveDSPs(activeDSPsData);

      const activeShifts = mappedShifts.filter(shift => 
        ['filled', 'assigned', 'active'].includes(shift.status) && shift.assignedDSP
      );
      
      const activeShiftIds = activeShifts.map(shift => shift.id);
      if (activeShiftIds.length > 0) {
        try {
          const shiftConversations = await fetchShiftConversations(token, activeShiftIds);
          setConversations(shiftConversations);
        } catch (convError) {
          console.error('Error fetching shift conversations:', convError);
          try {
            const generalConversations = await getConversations(token);
            setConversations(generalConversations);
          } catch (generalError) {
            console.error('Error fetching general conversations:', generalError);
            setConversations([]);
          }
        }
      } else {
        try {
          const generalConversations = await getConversations(token);
          setConversations(generalConversations);
        } catch (generalError) {
          console.error('Error fetching general conversations:', generalError);
          setConversations([]);
        }
      }

    } catch (error) {
      console.error('Error fetching agency data:', error);
      setError(error.message || 'Failed to fetch agency data');
      if (error.message.includes('authentication') || error.message.includes('token')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShiftPosted = async (shiftData) => {
  try {
    setError('');
    const token = getToken();
    if (!token) {
      setError('Authentication required. Please login again.');
      window.location.href = '/login';
      return;
    }

 
    const backendShiftData = {
      title: shiftData.title,
      location: shiftData.location,
      startTime: new Date(`${shiftData.date}T${shiftData.startTime}`).toISOString(),
      endTime: new Date(`${shiftData.date}T${shiftData.endTime}`).toISOString(),
      rate: parseFloat(shiftData.hourlyRate.replace('$', '') || shiftData.hourlyRate),
      requirements: shiftData.requiredCredentials,
      description: shiftData.description,
      clientName: shiftData.clientName,
      // Add missing fields that backend expects
      address: shiftData.address
    };

    const newShift = await createShift(token, backendShiftData);
    
    const mappedNewShift = mapShiftData([newShift])[0];
    setPostedShifts(prev => [mappedNewShift, ...prev]);
    setStats(prev => ({
      ...prev,
      totalShifts: prev.totalShifts + 1
    }));
    setShowShiftForm(false);
    
    toast({
      title: "Success!",
      description: "Shift posted successfully",
    });
  } catch (error) {
    console.error('Error posting shift:', error);
    setError(error.message || 'Failed to post shift');
    toast({
      title: "Error",
      description: error.message || "Failed to post shift",
      variant: "destructive"
    });
  }
};

  const handleUpdateShift = async (updatedShift) => {
    try {
      setError('');
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please login again.');
        window.location.href = '/login';
        return;
      }

      const backendShiftData = {
        title: updatedShift.title,
        location: updatedShift.location,
        startTime: new Date(`${updatedShift.date}T${updatedShift.startTime}`).toISOString(),
        endTime: new Date(`${updatedShift.date}T${updatedShift.endTime}`).toISOString(),
        rate: parseFloat(updatedShift.hourlyRate.replace('$', '')),
        requirements: updatedShift.requiredCredentials,
        description: updatedShift.description,
        clientName: updatedShift.clientName,
        status: updatedShift.status === 'active' ? 'open' : 
                updatedShift.status === 'filled' ? 'assigned' : 
                updatedShift.status === 'cancelled' ? 'cancelled' : 'open'
      };

      const result = await updateShift(token, updatedShift.id, backendShiftData);
      
      const mappedUpdatedShift = mapShiftData([result])[0];
      setPostedShifts(prev => 
        prev.map(shift => 
          shift.id === updatedShift.id ? mappedUpdatedShift : shift
        )
      );

      if (updatedShift.status === 'filled' || result.assignedDSP) {
        fetchAgencyData();
      }
    } catch (error) {
      setError(error.message || 'Failed to update shift');
    }
  };

  const handleDeleteShift = async (shiftId) => {
    try {
      setError('');
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please login again.');
        window.location.href = '/login';
        return;
      }

      await deleteShift(token, shiftId);
      
      setPostedShifts(prev => prev.filter(shift => shift.id !== shiftId));
      setStats(prev => ({
        ...prev,
        totalShifts: Math.max(0, prev.totalShifts - 1)
      }));
    } catch (error) {
      setError(error.message || 'Failed to delete shift');
    }
  };
  
  const handleUpdateDSPApplication = async (applicationId, status, notes = '') => {
    try {
      setError('');
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please login again.');
        window.location.href = '/login';
        return;
      }

      await updateDSPApplication(token, applicationId, status, notes);
      
      const updatedApplications = await getDSPApplications(token);
      setDspApplications(updatedApplications);
      
      await fetchAgencyData();
    } catch (error) {
      setError(error.message || 'Failed to update DSP application');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-medical-blue">ShiftLink Agency</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-medical-blue hover:bg-blue-800"
                onClick={() => setShowShiftForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Post New Shift
              </Button>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <span className="text-sm font-medium">{user?.agencyName || user?.firstName}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agency Dashboard</h2>
          <p className="text-gray-600">Manage your shifts, DSPs, and operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Shifts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalShifts}</p>
                </div>
                <Calendar className="w-8 h-8 text-medical-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active DSPs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeDSPs}</p>
                </div>
                <Users className="w-8 h-8 text-medical-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Apps</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisMonthHours}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shifts">Shift Management</TabsTrigger>
            <TabsTrigger value="dsps">DSP Network</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="shifts" className="space-y-6">
            {showShiftForm ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Post New Shift</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowShiftForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <ShiftPosting onShiftPosted={handleShiftPosted} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Manage Your Shifts</h3>
                  <Button 
                    className="bg-medical-blue hover:bg-blue-800"
                    onClick={() => setShowShiftForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Shift
                  </Button>
                </div>
                <PostedShiftsList 
                  shifts={postedShifts}
                  onUpdateShift={handleUpdateShift}
                  onDeleteShift={handleDeleteShift}
                  onMessageDSP={handleMessageDSPFromShift} // Use the renamed function
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="dsps" className="space-y-6">
            <DSPApprovalManager 
              applications={dspApplications}
              onUpdateApplication={handleUpdateDSPApplication}
            />
          </TabsContent>

<TabsContent value="messages" className="space-y-6">
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2">Message Center</h3>
    <p className="text-gray-600">Communicate with DSPs about active and upcoming shifts</p>
  </div>
  
  {/* Active DSPs Section */}
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="w-5 h-5" />
        Active DSPs ({activeDSPs.length})
      </CardTitle>
      <CardDescription>Click on a DSP to start a conversation</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeDSPs.map((dsp) => (
          <div key={dsp.dspId} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{dsp.firstName} {dsp.lastName}</p>
              <p className="text-sm text-gray-500">{dsp.shiftTitle}</p>
              <p className="text-xs text-gray-400">
                {dsp.shiftDate ? new Date(dsp.shiftDate).toLocaleDateString() : 'No shift'}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => handleMessageDSP(dsp.dspId, dsp.shiftId)}
            >
              Message
            </Button>
          </div>
        ))}
        {activeDSPs.length === 0 && (
          <div className="col-span-2 text-center py-4 text-gray-500">
            No active DSPs found
          </div>
        )}
      </div>
    </CardContent>
  </Card>

  {/* Working Messaging System */}
{conversations.length > 0 ? (
  <OptimizedMessagingSystem 
    userRole="agency"
    // Remove initialConversationId and onConversationChange since they're not in your component
  />
) : (
  <Card>
    <CardHeader>
      <CardTitle>Your Conversations</CardTitle>
      <CardDescription>Start a conversation by messaging a DSP above</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No conversations yet</p>
        <p className="text-sm">Message a DSP to start your first conversation</p>
      </div>
    </CardContent>
  </Card>
)}
</TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Analytics & Reports</h3>
              <p className="text-gray-600">Track your agency's performance, shift trends, and compliance metrics</p>
            </div>
            
            <Tabs defaultValue="shifts" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="shifts">Shift Analytics</TabsTrigger>
                <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="shifts">
                <ShiftAnalytics data={analytics} />
              </TabsContent>

              <TabsContent value="compliance">
                <ComplianceReports data={compliance} />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgencyDashboard;