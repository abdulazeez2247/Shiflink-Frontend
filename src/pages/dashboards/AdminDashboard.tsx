
// import { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Users, DollarSign, TrendingUp, AlertTriangle, Settings, Activity, Shield, Clock } from 'lucide-react';
// import AdminCommissionManager from '@/components/AdminCommissionManager';
// import PlatformSettingsDialog from '@/components/PlatformSettingsDialog';

// const AdminDashboard = () => {
//   const [stats] = useState({
//     totalUsers: 1245,
//     totalRevenue: 45750.25,
//     totalCommission: 5687.50,
//     pendingPayouts: 1250.00,
//     activeTrainers: 23,
//     activeDSPs: 156,
//     pendingApprovals: 8
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Enhanced Header */}
//       <div className="bg-white shadow-lg border-b border-slate-200/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex justify-between items-center">
//             <div className="space-y-1">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
//                   <Shield className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
//                     Admin Dashboard
//                   </h1>
//                   <p className="text-slate-600 font-medium">Platform administration and commission management</p>
//                 </div>
//               </div>
//             </div>
//             <PlatformSettingsDialog>
//               <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2.5">
//                 <Settings className="w-4 h-4 mr-2" />
//                 Platform Settings
//               </Button>
//             </PlatformSettingsDialog>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Enhanced Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ring-1 ring-slate-200/50">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Users</p>
//                   <p className="text-3xl font-bold text-blue-700">{stats.totalUsers.toLocaleString()}</p>
//                   <div className="flex items-center gap-1 text-xs">
//                     <TrendingUp className="w-3 h-3 text-green-500" />
//                     <span className="text-green-600 font-medium">+12% this month</span>
//                   </div>
//                 </div>
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//                   <Users className="w-6 h-6 text-white" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ring-1 ring-slate-200/50">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Revenue</p>
//                   <p className="text-3xl font-bold text-green-700">${stats.totalRevenue.toLocaleString()}</p>
//                   <div className="flex items-center gap-1 text-xs">
//                     <TrendingUp className="w-3 h-3 text-green-500" />
//                     <span className="text-green-600 font-medium">+8.5% this month</span>
//                   </div>
//                 </div>
//                 <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
//                   <DollarSign className="w-6 h-6 text-white" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ring-1 ring-slate-200/50">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Platform Commission</p>
//                   <p className="text-3xl font-bold text-purple-700">${stats.totalCommission.toLocaleString()}</p>
//                   <div className="flex items-center gap-1 text-xs">
//                     <Activity className="w-3 h-3 text-purple-500" />
//                     <span className="text-purple-600 font-medium">15% avg rate</span>
//                   </div>
//                 </div>
//                 <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//                   <TrendingUp className="w-6 h-6 text-white" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ring-1 ring-slate-200/50">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Pending Approvals</p>
//                   <p className="text-3xl font-bold text-orange-700">{stats.pendingApprovals}</p>
//                   <div className="flex items-center gap-1 text-xs">
//                     <Clock className="w-3 h-3 text-orange-500" />
//                     <span className="text-orange-600 font-medium">Needs attention</span>
//                   </div>
//                 </div>
//                 <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
//                   <AlertTriangle className="w-6 h-6 text-white" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Enhanced Main Content Tabs */}
//         <div className="bg-white rounded-2xl shadow-xl border-0 ring-1 ring-slate-200/50 overflow-hidden">
//           <Tabs defaultValue="commission" className="w-full">
//             <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 pt-6 pb-2 border-b border-slate-200/50">
//               <TabsList className="grid w-full grid-cols-4 bg-white shadow-md border border-slate-200/50 p-1 rounded-xl">
//                 <TabsTrigger 
//                   value="commission" 
//                   className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-200"
//                 >
//                   Commission
//                 </TabsTrigger>
//                 <TabsTrigger 
//                   value="users"
//                   className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-200"
//                 >
//                   Users
//                 </TabsTrigger>
//                 <TabsTrigger 
//                   value="approvals"
//                   className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-200"
//                 >
//                   Approvals
//                 </TabsTrigger>
//                 <TabsTrigger 
//                   value="analytics"
//                   className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-200"
//                 >
//                   Analytics
//                 </TabsTrigger>
//               </TabsList>
//             </div>

//             <div className="p-6">
//               <TabsContent value="commission" className="mt-0">
//                 <AdminCommissionManager />
//               </TabsContent>

//               <TabsContent value="users" className="mt-0">
//                 <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
//                   <CardHeader className="pb-4">
//                     <CardTitle className="flex items-center gap-2 text-slate-800">
//                       <Users className="w-5 h-5 text-blue-600" />
//                       User Management
//                     </CardTitle>
//                     <CardDescription className="text-slate-600">
//                       Manage trainers, DSPs, and agency accounts across the platform
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-center py-12">
//                       <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                         <Users className="w-10 h-10 text-blue-500" />
//                       </div>
//                       <h3 className="text-lg font-semibold text-slate-800 mb-2">User Management Coming Soon</h3>
//                       <p className="text-slate-600 max-w-md mx-auto">
//                         Advanced user management features including role assignments, account verification, and bulk operations will be available here.
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="approvals" className="mt-0">
//                 <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
//                   <CardHeader className="pb-4">
//                     <CardTitle className="flex items-center gap-2 text-slate-800">
//                       <AlertTriangle className="w-5 h-5 text-orange-600" />
//                       Pending Approvals
//                       <Badge variant="secondary" className="bg-orange-100 text-orange-700 font-semibold">
//                         {stats.pendingApprovals} pending
//                       </Badge>
//                     </CardTitle>
//                     <CardDescription className="text-slate-600">
//                       Review trainer applications and certificate approvals
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-center py-12">
//                       <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                         <AlertTriangle className="w-10 h-10 text-orange-500" />
//                       </div>
//                       <h3 className="text-lg font-semibold text-slate-800 mb-2">Approval System Coming Soon</h3>
//                       <p className="text-slate-600 max-w-md mx-auto">
//                         Streamlined approval workflows for trainer certifications, course submissions, and account verifications will be available here.
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="analytics" className="mt-0">
//                 <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
//                   <CardHeader className="pb-4">
//                     <CardTitle className="flex items-center gap-2 text-slate-800">
//                       <TrendingUp className="w-5 h-5 text-purple-600" />
//                       Platform Analytics
//                     </CardTitle>
//                     <CardDescription className="text-slate-600">
//                       View detailed platform performance metrics and insights
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-center py-12">
//                       <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                         <TrendingUp className="w-10 h-10 text-purple-500" />
//                       </div>
//                       <h3 className="text-lg font-semibold text-slate-800 mb-2">Analytics Dashboard Coming Soon</h3>
//                       <p className="text-slate-600 max-w-md mx-auto">
//                         Comprehensive analytics including user engagement, revenue trends, course performance, and platform health metrics.
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </div>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, DollarSign, TrendingUp, AlertTriangle, Settings, Activity, Shield, Clock } from 'lucide-react';
import AdminCommissionManager from '@/components/AdminCommissionManager';
import PlatformSettingsDialog from '@/components/PlatformSettingsDialog';
import { getAdminStats, getAuditLogs, suspendUser, reinstateUser }  from '@/service/data';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalCommission: 0,
    pendingPayouts: 0,
    activeTrainers: 0,
    activeDSPs: 0,
    pendingApprovals: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = getToken();
      
      if (!token) {
        setError('Authentication required. Please login again.');
        window.location.href = '/login';
        return;
      }

      const statsData = await getAdminStats(token);
      setStats(statsData);
    } catch (error) {
      setError(error.message || 'Failed to fetch admin data');
      if (error.message.includes('authentication') || error.message.includes('token')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white shadow-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-slate-600 font-medium">Platform administration and commission management</p>
                </div>
              </div>
            </div>
            <PlatformSettingsDialog>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2.5">
                <Settings className="w-4 h-4 mr-2" />
                Platform Settings
              </Button>
            </PlatformSettingsDialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ring-1 ring-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Users</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.totalUsers.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-green-600 font-medium">+12% this month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ring-1 ring-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-700">${stats.totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-green-600 font-medium">+8.5% this month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ring-1 ring-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Platform Commission</p>
                  <p className="text-3xl font-bold text-purple-700">${stats.totalCommission.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <Activity className="w-3 h-3 text-purple-500" />
                    <span className="text-purple-600 font-medium">15% avg rate</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ring-1 ring-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Pending Approvals</p>
                  <p className="text-3xl font-bold text-orange-700">{stats.pendingApprovals}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span className="text-orange-600 font-medium">Needs attention</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border-0 ring-1 ring-slate-200/50 overflow-hidden">
          <Tabs defaultValue="commission" className="w-full">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 pt-6 pb-2 border-b border-slate-200/50">
              <TabsList className="grid w-full grid-cols-4 bg-white shadow-md border border-slate-200/50 p-1 rounded-xl">
                <TabsTrigger 
                  value="commission" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-200"
                >
                  Commission
                </TabsTrigger>
                <TabsTrigger 
                  value="users"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-200"
                >
                  Users
                </TabsTrigger>
                <TabsTrigger 
                  value="approvals"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-200"
                >
                  Approvals
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold transition-all duration-200"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="commission" className="mt-0">
                <AdminCommissionManager />
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Users className="w-5 h-5 text-blue-600" />
                      User Management
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Manage trainers, DSPs, and agency accounts across the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">User Management Coming Soon</h3>
                      <p className="text-slate-600 max-w-md mx-auto">
                        Advanced user management features including role assignments, account verification, and bulk operations will be available here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approvals" className="mt-0">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Pending Approvals
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 font-semibold">
                        {stats.pendingApprovals} pending
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Review trainer applications and certificate approvals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-10 h-10 text-orange-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Approval System Coming Soon</h3>
                      <p className="text-slate-600 max-w-md mx-auto">
                        Streamlined approval workflows for trainer certifications, course submissions, and account verifications will be available here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Platform Analytics
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      View detailed platform performance metrics and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-10 h-10 text-purple-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Analytics Dashboard Coming Soon</h3>
                      <p className="text-slate-600 max-w-md mx-auto">
                        Comprehensive analytics including user engagement, revenue trends, course performance, and platform health metrics.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;