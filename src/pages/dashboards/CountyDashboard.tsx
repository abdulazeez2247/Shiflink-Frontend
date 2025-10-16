
// import { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Users, TrendingUp, Flag, Calendar, FileText, AlertTriangle, CheckCircle, Building, MapPin } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import ShiftAnalytics from '@/components/ShiftAnalytics';
// import CredentialReports from '@/components/CredentialReports';
// import DSPApprovalManager from '@/components/DSPApprovalManager';
// import JobFairManager from '@/components/JobFairManager';
// import CountyReportGenerator from '@/components/CountyReportGenerator';

// const CountyDashboard = () => {
//   const { toast } = useToast();
  
//   const stats = {
//     totalDSPs: 156,
//     pendingApprovals: 12,
//     activeDSPs: 144,
//     flaggedDSPs: 8,
//     upcomingJobFairs: 3,
//     totalShifts: 2847,
//     credentialIssues: 23,
//     complianceRate: 94.2,
//     activeDrivers: 45,
//     transportationRequests: 89
//   };

//   const handleGenerateReport = () => {
//     console.log('Generate Report clicked');
    
//     // Create comprehensive report data
//     const reportData = {
//       'Report Generation Date': new Date().toISOString().split('T')[0],
//       'Report Generation Time': new Date().toLocaleTimeString(),
//       'Report Type': 'County Board Compliance Report',
//       'Reporting Period': 'Current Month',
//       'Section 1': 'DSP Statistics',
//       'Total DSPs': stats.totalDSPs,
//       'Active DSPs': stats.activeDSPs,
//       'Pending Approvals': stats.pendingApprovals,
//       'Flagged DSPs': stats.flaggedDSPs,
//       'Section 2': 'Operational Metrics',
//       'Total Shifts': stats.totalShifts,
//       'Upcoming Job Fairs': stats.upcomingJobFairs,
//       'Credential Issues': stats.credentialIssues,
//       'Compliance Rate': `${stats.complianceRate}%`,
//       'Section 3': 'Transportation Metrics',
//       'Active Drivers': stats.activeDrivers,
//       'Transportation Requests': stats.transportationRequests,
//       'Section 4': 'Compliance Status',
//       'Overall Rating': stats.complianceRate >= 95 ? 'Excellent' : stats.complianceRate >= 90 ? 'Good' : 'Needs Improvement',
//       'Action Required': stats.credentialIssues > 20 ? 'Yes - Address credential issues' : 'No - Monitoring only',
//       'Recommendations': stats.flaggedDSPs > 5 ? 'Review flagged DSPs immediately' : 'Continue regular monitoring'
//     };

//     // Convert to CSV format
//     const csvContent = Object.entries(reportData)
//       .map(([key, value]) => `"${key}","${value}"`)
//       .join('\n');

//     // Create and download the file
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `county-board-report-${new Date().toISOString().split('T')[0]}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);

//     toast({
//       title: "Report Generated Successfully",
//       description: "County Board compliance report has been downloaded to your device.",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">County Board Dashboard</h1>
//               <p className="text-gray-600">Regional oversight and compliance management</p>
//             </div>
//             <Button 
//               className="bg-blue-600 hover:bg-blue-700"
//               onClick={handleGenerateReport}
//             >
//               <FileText className="w-4 h-4 mr-2" />
//               Generate Report
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Enhanced Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Active DSPs</p>
//                   <p className="text-2xl font-bold text-green-600">{stats.activeDSPs}</p>
//                 </div>
//                 <CheckCircle className="w-8 h-8 text-green-500" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
//                   <p className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}</p>
//                 </div>
//                 <AlertTriangle className="w-8 h-8 text-orange-500" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Flagged DSPs</p>
//                   <p className="text-2xl font-bold text-red-600">{stats.flaggedDSPs}</p>
//                 </div>
//                 <Flag className="w-8 h-8 text-red-500" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Active Drivers</p>
//                   <p className="text-2xl font-bold text-blue-600">{stats.activeDrivers}</p>
//                 </div>
//                 <MapPin className="w-8 h-8 text-blue-500" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
//                   <p className="text-2xl font-bold text-blue-600">{stats.complianceRate}%</p>
//                 </div>
//                 <TrendingUp className="w-8 h-8 text-blue-500" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Content Tabs */}
//         <Tabs defaultValue="analytics" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-6">
//             <TabsTrigger value="analytics">Analytics</TabsTrigger>
//             <TabsTrigger value="credentials">Credentials</TabsTrigger>
//             <TabsTrigger value="dsps">DSP Management</TabsTrigger>
//             <TabsTrigger value="jobfairs">Job Fairs</TabsTrigger>
//             <TabsTrigger value="reports">Reports</TabsTrigger>
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//           </TabsList>

//           <TabsContent value="analytics">
//             <ShiftAnalytics />
//           </TabsContent>

//           <TabsContent value="credentials">
//             <CredentialReports />
//           </TabsContent>

//           <TabsContent value="dsps">
//             <DSPApprovalManager />
//           </TabsContent>

//           <TabsContent value="jobfairs">
//             <JobFairManager />
//           </TabsContent>

//           <TabsContent value="reports">
//             <CountyReportGenerator />
//           </TabsContent>

//           <TabsContent value="overview">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Regional Facilities Overview */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Building className="w-5 h-5" />
//                     Regional Facilities
//                   </CardTitle>
//                   <CardDescription>Overview of facilities in your county jurisdiction</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {[
//                       { name: 'Sunrise Care Center', dsps: 28, status: 'Compliant', location: 'Columbus' },
//                       { name: 'Valley View Residential', dsps: 22, status: 'Review Required', location: 'Dublin' },
//                       { name: 'Maple Heights Support', dsps: 19, status: 'Compliant', location: 'Westerville' },
//                       { name: 'Riverside Manor', dsps: 31, status: 'Compliant', location: 'Delaware' },
//                       { name: 'Oakwood Center', dsps: 25, status: 'Non-Compliant', location: 'Worthington' }
//                     ].map((facility, index) => (
//                       <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
//                         <div>
//                           <p className="font-medium">{facility.name}</p>
//                           <p className="text-sm text-gray-500">{facility.dsps} DSPs • {facility.location}</p>
//                         </div>
//                         <Badge 
//                           variant={facility.status === 'Compliant' ? 'default' : 
//                                   facility.status === 'Review Required' ? 'secondary' : 'destructive'}
//                           className={facility.status === 'Compliant' ? 'bg-green-500' : 
//                                     facility.status === 'Review Required' ? 'bg-orange-500' : ''}
//                         >
//                           {facility.status}
//                         </Badge>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Recent Activity */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Recent Activity</CardTitle>
//                   <CardDescription>Latest updates and actions in your county</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {[
//                       { 
//                         action: 'DSP Application Approved', 
//                         details: 'Sarah Johnson - Valley View Residential',
//                         time: '2 hours ago',
//                         type: 'approval'
//                       },
//                       { 
//                         action: 'Credential Expiring Soon', 
//                         details: 'CPR Certification - Mike Wilson',
//                         time: '4 hours ago',
//                         type: 'alert'
//                       },
//                       { 
//                         action: 'Job Fair Scheduled', 
//                         details: 'Columbus Community Center - June 25th',
//                         time: '1 day ago',
//                         type: 'event'
//                       },
//                       { 
//                         action: 'Shift Coverage Alert', 
//                         details: 'Maple Heights - Weekend coverage needed',
//                         time: '2 days ago',
//                         type: 'alert'
//                       }
//                     ].map((activity, index) => (
//                       <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
//                         <div className={`w-3 h-3 rounded-full mt-1 ${
//                           activity.type === 'approval' ? 'bg-green-500' :
//                           activity.type === 'alert' ? 'bg-orange-500' :
//                           'bg-blue-500'
//                         }`} />
//                         <div className="flex-1">
//                           <p className="font-medium text-sm">{activity.action}</p>
//                           <p className="text-sm text-gray-600">{activity.details}</p>
//                           <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default CountyDashboard;
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, Flag, Calendar, FileText, AlertTriangle, CheckCircle, Building, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCountyStats, getCountyFacilities, getCountyRecentActivity } from '@/service/data';

const CountyDashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get token from localStorage
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, facilitiesData, activityData] = await Promise.all([
        getCountyStats(token),
        getCountyFacilities(token),
        getCountyRecentActivity(token)
      ]);
      
      setStats(statsData);
      setFacilities(facilitiesData);
      setRecentActivity(activityData);
    } catch (error) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (!stats) return;
    
    const reportData = {
      'Report Generation Date': new Date().toISOString().split('T')[0],
      'Report Type': 'County Board Compliance Report',
      'Total DSPs': stats.totalDSPs,
      'Active DSPs': stats.activeDSPs,
      'Pending Approvals': stats.pendingApprovals,
      'Flagged DSPs': stats.flaggedDSPs,
      'Credential Issues': stats.credentialIssues,
      'Compliance Rate': `${stats.complianceRate}%`
    };

    const csvContent = Object.entries(reportData)
      .map(([key, value]) => `"${key}","${value}"`)
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `county-board-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report Generated Successfully",
      description: "County Board compliance report has been downloaded.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">County Board Dashboard</h1>
              <p className="text-gray-600">Regional oversight and compliance management</p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleGenerateReport}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active DSPs</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeDSPs}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Flagged DSPs</p>
                  <p className="text-2xl font-bold text-red-600">{stats.flaggedDSPs}</p>
                </div>
                <Flag className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.complianceRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="facilities">Agencies</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Statistics</CardTitle>
                  <CardDescription>Overview of county operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Total DSPs</span>
                      <Badge variant="outline">{stats.totalDSPs}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Credential Issues</span>
                      <Badge variant="destructive">{stats.credentialIssues}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                  <CardDescription>Current compliance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Overall Compliance Rate</span>
                      <Badge 
                        variant={
                          stats.complianceRate >= 95 ? 'default' : 
                          stats.complianceRate >= 90 ? 'secondary' : 'destructive'
                        }
                        className={
                          stats.complianceRate >= 95 ? 'bg-green-500' : 
                          stats.complianceRate >= 90 ? 'bg-orange-500' : ''
                        }
                      >
                        {stats.complianceRate}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>DSPs Requiring Attention</span>
                      <Badge variant="destructive">{stats.flaggedDSPs + stats.pendingApprovals}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="facilities">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Agencies in County
                </CardTitle>
                <CardDescription>Agencies operating in your county jurisdiction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {facilities.map((facility, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{facility.name}</p>
                        <p className="text-sm text-gray-500">{facility.dsps} DSPs • {facility.location}</p>
                      </div>
                      <Badge 
                        variant={facility.status === 'Compliant' ? 'default' : 'destructive'}
                        className={facility.status === 'Compliant' ? 'bg-green-500' : ''}
                      >
                        {facility.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        activity.type === 'approval' ? 'bg-green-500' :
                        activity.type === 'alert' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CountyDashboard;