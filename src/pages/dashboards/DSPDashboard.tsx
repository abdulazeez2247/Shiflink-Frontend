
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress'; // Add this import
// import { useEffect, useState, useCallback } from 'react';
// import { 
//   getAvailableShifts, 
//   getDSPBookings, 
//   updateDSPAvailability, 
//   bookShift, 
//   cancelBooking,
//   checkComplianceStatus, // Add this import
//   getRequiredDocuments, // Add this import
//   uploadCredential, // Add this import
//   getUserCredentials // Add this import
// } from '@/service/data';
// import { useToast } from '@/components/ui/use-toast';
// import { Calendar, Clock, MapPin, DollarSign, User, CheckCircle, XCircle, AlertTriangle, Upload } from 'lucide-react'; // Add icons

// const DSPDashboard = () => {
//   const { toast } = useToast();
//   const [availableShifts, setAvailableShifts] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [availability, setAvailability] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('shifts');
  
//   // Add compliance states
//   const [compliance, setCompliance] = useState({
//     isComplete: false,
//     completedItems: [],
//     missingItems: [],
//     progress: { completed: 0, total: 0, percentage: 0 }
//   });
//   const [requiredDocs, setRequiredDocs] = useState([]);
//   const [userCredentials, setUserCredentials] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   // Get authentication data
//   const token = localStorage.getItem('token');
//   const userStr = localStorage.getItem('user');
//   const user = userStr ? JSON.parse(userStr) : null;

//   // Fetch compliance data
//   const fetchComplianceData = useCallback(async () => {
//     if (!token) return;
    
//     try {
//       console.log('📋 Fetching compliance data...');
//       const [status, docs, creds] = await Promise.all([
//         checkComplianceStatus(token),
//         getRequiredDocuments(token),
//         getUserCredentials(token)
//       ]);
      
//       setCompliance(status);
//       setRequiredDocs(docs);
//       setUserCredentials(creds);
//       console.log('✅ Compliance status:', status.isComplete ? 'Complete' : 'Incomplete');
//     } catch (error) {
//       console.error('❌ Error fetching compliance data:', error);
//       toast({ 
//         title: "Error", 
//         description: "Failed to load compliance data", 
//         variant: "destructive" 
//       });
//     }
//   }, [token, toast]);

//   // Memoized functions to prevent infinite re-renders
//   const fetchShifts = useCallback(async () => {
//     if (!token) return;
    
//     try {
//       console.log('🔄 Fetching available shifts...');
//       const shifts = await getAvailableShifts(token);
//       setAvailableShifts(shifts);
//     } catch (error) {
//       console.error('❌ Error fetching shifts:', error);
//       toast({ 
//         title: "Error", 
//         description: error.message || "Failed to load shifts", 
//         variant: "destructive" 
//       });
//     }
//   }, [token, toast]);

//   const fetchBookings = useCallback(async () => {
//     if (!token) return;
    
//     try {
//       console.log('🔄 Fetching bookings...');
//       const bookingsData = await getDSPBookings(token);
//       setBookings(bookingsData);
//     } catch (error) {
//       console.error('❌ Error fetching bookings:', error);
//       toast({ 
//         title: "Error", 
//         description: error.message || "Failed to load bookings", 
//         variant: "destructive" 
//       });
//     }
//   }, [token, toast]);

//   const fetchInitialData = useCallback(async () => {
//     if (!token || !user) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       console.log('🚀 Starting initial data fetch...');
//       setIsLoading(true);
      
//       // Fetch all data including compliance
//       await Promise.all([
//         fetchShifts().catch(err => console.error('Shift fetch error:', err)),
//         fetchBookings().catch(err => console.error('Booking fetch error:', err)),
//         fetchComplianceData().catch(err => console.error('Compliance fetch error:', err))
//       ]);
      
//       console.log('✅ Initial data fetch completed');
//     } catch (error) {
//       console.error('❌ Error in initial data fetch:', error);
//       toast({ 
//         title: "Error", 
//         description: "Failed to load dashboard data", 
//         variant: "destructive" 
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [token, user, fetchShifts, fetchBookings, fetchComplianceData, toast]);

//   // Fixed useEffect - runs only once on component mount
//   useEffect(() => {
//     console.log('🏠 DSPDashboard mounted - fetching initial data');
    
//     const loadData = async () => {
//       if (token && user) {
//         await fetchInitialData();
//       } else {
//         console.log('❌ No token or user found');
//         setIsLoading(false);
//         toast({ 
//           title: "Authentication Error", 
//           description: "Please log in again", 
//           variant: "destructive" 
//         });
//       }
//     };

//     loadData();

//     // Cleanup function
//     return () => {
//       console.log('🧹 DSPDashboard cleanup');
//     };
//   }, []); // Empty dependency array - runs only once

//   // UPDATED: Handle book shift with compliance check
//   const handleBookShift = async (shiftId) => {
//     if (!token) {
//       toast({ 
//         title: "Error", 
//         description: "Please log in again", 
//         variant: "destructive" 
//       });
//       return;
//     }

//     // Check compliance status first
//     if (!compliance.isComplete) {
//       toast({ 
//         title: "Compliance Required", 
//         description: `Please complete your compliance requirements: ${compliance.missingItems.join(', ')}`, 
//         variant: "destructive" 
//       });
//       setActiveTab('compliance'); // Redirect to compliance tab
//       return;
//     }

//     try {
//       console.log('📅 Booking shift:', shiftId);
//       await bookShift(token, shiftId);
//       toast({ title: "Success", description: "Shift booked successfully!" });
      
//       // Refresh data
//       await fetchShifts();
//       setActiveTab('bookings');
//     } catch (error) {
//       console.error('❌ Error booking shift:', error);
      
//       // Handle compliance errors from backend
//       if (error.message.includes('compliance not complete')) {
//         toast({ 
//           title: "Compliance Required", 
//           description: "Please complete all compliance requirements", 
//           variant: "destructive" 
//         });
//         setActiveTab('compliance');
//       } else {
//         toast({ title: "Error", description: error.message, variant: "destructive" });
//       }
//     }
//   };

//   // Add file upload handler
//   const handleFileUpload = async (documentType, file) => {
//     if (!token) return;
    
//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('document', file);
//       formData.append('type', documentType);
      
//       await uploadCredential(token, formData);
//       toast({ title: "Success", description: "Document uploaded successfully!" });
      
//       // Refresh compliance data
//       await fetchComplianceData();
//     } catch (error) {
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleCancelBooking = async (bookingId) => {
//     if (!token) {
//       toast({ 
//         title: "Error", 
//         description: "Please log in again", 
//         variant: "destructive" 
//       });
//       return;
//     }

//     try {
//       console.log('❌ Cancelling booking:', bookingId);
//       await cancelBooking(token, bookingId);
//       toast({ title: "Success", description: "Booking cancelled successfully" });
      
//       await fetchBookings();
//     } catch (error) {
//       console.error('❌ Error cancelling booking:', error);
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//     }
//   };

//   const handleAvailabilityUpdate = async (newAvailability) => {
//     if (!token) {
//       toast({ 
//         title: "Error", 
//         description: "Please log in again", 
//         variant: "destructive" 
//       });
//       return;
//     }

//     try {
//       console.log('📊 Updating availability:', newAvailability);
//       await updateDSPAvailability(token, newAvailability);
//       setAvailability(newAvailability);
//       toast({ title: "Success", description: "Availability updated successfully" });
//     } catch (error) {
//       console.error('❌ Error updating availability:', error);
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       'pending': { variant: 'secondary', label: 'Pending' },
//       'confirmed': { variant: 'default', label: 'Confirmed' },
//       'completed': { variant: 'outline', label: 'Completed' },
//       'cancelled': { variant: 'destructive', label: 'Cancelled' }
//     };
    
//     const config = statusConfig[status] || { variant: 'secondary', label: status };
//     return <Badge variant={config.variant}>{config.label}</Badge>;
//   };

//   // Manual refresh function
//   const handleManualRefresh = async () => {
//     console.log('🔄 Manual refresh triggered');
//     if (token && user) {
//       setIsLoading(true);
//       try {
//         await fetchInitialData();
//         toast({ title: "Refreshed", description: "Data updated successfully" });
//       } catch (error) {
//         toast({ title: "Refresh Error", description: "Failed to refresh data", variant: "destructive" });
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-xl text-red-600">Session Expired</h2>
//           <p>Please log in again to continue</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header with Refresh Button */}
//         <div className="mb-8">
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">DSP Dashboard</h1>
//               <p className="text-gray-600">Welcome back, {user.first_name} {user.last_name}!</p>
//               <p className="text-sm text-gray-500">Manage your shifts and availability</p>
              
//               {/* Compliance Status Badge */}
//               {!compliance.isComplete && (
//                 <Badge variant="destructive" className="mt-2">
//                   Compliance Incomplete ({compliance.missingItems.length} items missing)
//                 </Badge>
//               )}
//             </div>
//             <div className="text-right">
//               <Button 
//                 variant="outline" 
//                 onClick={handleManualRefresh}
//                 className="mb-2"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Refreshing...' : 'Refresh Data'}
//               </Button>
//               <p className="text-sm text-gray-600">Member since {new Date(user.createdAt).getFullYear()}</p>
//               <Badge variant="outline" className="mt-1">{user.role.toUpperCase()}</Badge>
//             </div>
//           </div>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"> {/* Changed to 4 columns */}
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <Calendar className="h-8 w-8 text-blue-600 mr-4" />
//                 <div>
//                   <p className="text-2xl font-bold">{availableShifts.length}</p>
//                   <p className="text-sm text-gray-600">Available Shifts</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
//                 <div>
//                   <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'confirmed').length}</p>
//                   <p className="text-sm text-gray-600">Confirmed Bookings</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <Clock className="h-8 w-8 text-orange-600 mr-4" />
//                 <div>
//                   <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'pending').length}</p>
//                   <p className="text-sm text-gray-600">Pending Requests</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center">
//                 <AlertTriangle className={`h-8 w-8 ${compliance.isComplete ? 'text-green-600' : 'text-red-600'} mr-4`} />
//                 <div>
//                   <p className="text-2xl font-bold">{compliance.progress.percentage}%</p>
//                   <p className="text-sm text-gray-600">Compliance Complete</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Content Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-4"> {/* Changed to 4 columns */}
//             <TabsTrigger value="shifts">Available Shifts</TabsTrigger>
//             <TabsTrigger value="bookings">My Bookings ({bookings.length})</TabsTrigger>
//             <TabsTrigger value="compliance">Compliance</TabsTrigger> {/* Added Compliance tab */}
//             <TabsTrigger value="availability">Availability</TabsTrigger>
//           </TabsList>
          
//           {/* Available Shifts Tab */}
//           <TabsContent value="shifts" className="mt-6">
//             <div className="grid gap-6">
//               {availableShifts.length === 0 ? (
//                 <Card>
//                   <CardContent className="p-6 text-center">
//                     <p className="text-gray-500">No available shifts at the moment.</p>
//                     <p className="text-sm text-gray-400">Check back later for new opportunities.</p>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 availableShifts.map((shift) => (
//                   <Card key={shift._id} className="hover:shadow-lg transition-shadow">
//                     <CardHeader>
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <CardTitle className="flex items-center gap-2">
//                             {shift.title}
//                             <Badge variant="outline">{shift.type || 'General'}</Badge>
//                           </CardTitle>
//                           <CardDescription className="flex items-center gap-1 mt-2">
//                             <MapPin className="h-4 w-4" />
//                             {shift.location}
//                           </CardDescription>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-2xl font-bold text-green-600">${shift.rate}<span className="text-sm font-normal">/hour</span></p>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="h-4 w-4 text-gray-500" />
//                           <span>{new Date(shift.startTime).toLocaleDateString()}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Clock className="h-4 w-4 text-gray-500" />
//                           <span>
//                             {new Date(shift.startTime).toLocaleTimeString()} - {new Date(shift.endTime).toLocaleTimeString()}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <User className="h-4 w-4" />
//                           <span>Posted by: {shift.agency?.firstname} {shift.agency?.lastname}</span>
//                         </div>
//                         <Button 
//                           onClick={() => handleBookShift(shift._id)}
//                           className="bg-blue-600 hover:bg-blue-700"
//                           disabled={isLoading || !compliance.isComplete}
//                           title={!compliance.isComplete ? "Complete compliance requirements to book shifts" : ""}
//                         >
//                           {!compliance.isComplete ? "Compliance Required" : isLoading ? 'Booking...' : 'Book Shift'}
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))
//               )}
//             </div>
//           </TabsContent>
          
//           {/* My Bookings Tab */}
//           <TabsContent value="bookings" className="mt-6">
//             <div className="grid gap-6">
//               {bookings.length === 0 ? (
//                 <Card>
//                   <CardContent className="p-6 text-center">
//                     <p className="text-gray-500">You haven't booked any shifts yet.</p>
//                     <p className="text-sm text-gray-400">Browse available shifts to get started.</p>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 bookings.map((booking) => (
//                   <Card key={booking._id}>
//                     <CardHeader>
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <CardTitle>{booking.shift?.title}</CardTitle>
//                           <CardDescription className="flex items-center gap-1 mt-2">
//                             <MapPin className="h-4 w-4" />
//                             {booking.shift?.location}
//                           </CardDescription>
//                         </div>
//                         <div className="text-right">
//                           {getStatusBadge(booking.status)}
//                           <p className="text-lg font-semibold text-green-600 mt-1">
//                             ${booking.shift?.rate}/hour
//                           </p>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                         <div>
//                           <p className="text-sm text-gray-600">Date & Time</p>
//                           <p className="font-medium">
//                             {new Date(booking.shift?.startTime).toLocaleString()} - {' '}
//                             {new Date(booking.shift?.endTime).toLocaleString()}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-sm text-gray-600">Agency</p>
//                           <p className="font-medium">
//                             {booking.agency?.firstname} {booking.agency?.lastname}
//                           </p>
//                         </div>
//                       </div>
//                       {booking.status === 'pending' && (
//                         <div className="flex gap-2">
//                           <Button 
//                             variant="outline" 
//                             size="sm"
//                             onClick={() => handleCancelBooking(booking._id)}
//                             disabled={isLoading}
//                           >
//                             <XCircle className="h-4 w-4 mr-1" />
//                             {isLoading ? 'Cancelling...' : 'Cancel Request'}
//                           </Button>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 ))
//               )}
//             </div>
//           </TabsContent>
          
//           {/* NEW: Compliance Tab */}
//           <TabsContent value="compliance" className="mt-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Compliance Requirements</CardTitle>
//                 <CardDescription>
//                   {compliance.isComplete ? 
//                     "✅ All compliance requirements completed! You can now book shifts." : 
//                     `Complete ${compliance.missingItems.length} more requirements to book shifts`}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Progress Bar */}
//                 <div className="mb-6">
//                   <div className="flex justify-between mb-2">
//                     <span className="text-sm font-medium">Compliance Progress</span>
//                     <span className="text-sm text-gray-600">
//                       {compliance.progress.completed}/{compliance.progress.total} ({compliance.progress.percentage}%)
//                     </span>
//                   </div>
//                   <Progress value={compliance.progress.percentage} className="h-2" />
//                 </div>

//                 {/* Required Documents List */}
//                 <div className="space-y-4">
//                   {requiredDocs.map((doc) => {
//                     const isCompleted = compliance.completedItems.includes(doc.id);
//                     const userDoc = userCredentials.find(cred => cred.type === doc.id);
                    
//                     return (
//                       <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
//                         <div className="flex-1">
//                           <h3 className="font-semibold flex items-center gap-2">
//                             {doc.name}
//                             {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
//                           </h3>
//                           <p className="text-sm text-gray-600">{doc.description}</p>
//                           <p className="text-xs text-gray-500">
//                             Accepted: {doc.acceptedFormats.join(', ')} • Max: {doc.maxSize}
//                           </p>
//                           {userDoc && (
//                             <p className="text-xs text-blue-600">
//                               Uploaded: {new Date(userDoc.uploadedAt).toLocaleDateString()}
//                               {userDoc.expiryDate && ` • Expires: ${new Date(userDoc.expiryDate).toLocaleDateString()}`}
//                             </p>
//                           )}
//                         </div>
                        
//                         <div className="flex items-center gap-2">
//                           {isCompleted ? (
//                             <Badge variant="outline" className="bg-green-100 text-green-800">
//                               Completed
//                             </Badge>
//                           ) : (
//                             <div>
//                               <input
//                                 type="file"
//                                 id={`file-${doc.id}`}
//                                 className="hidden"
//                                 accept={doc.acceptedFormats.map(f => `.${f}`).join(',')}
//                                 onChange={(e) => e.target.files[0] && handleFileUpload(doc.id, e.target.files[0])}
//                                 disabled={uploading}
//                               />
//                               <label htmlFor={`file-${doc.id}`}>
//                                 <Button variant="outline" size="sm" asChild disabled={uploading}>
//                                   <span className="flex items-center gap-1">
//                                     <Upload className="h-4 w-4" />
//                                     {uploading ? 'Uploading...' : 'Upload'}
//                                   </span>
//                                 </Button>
//                               </label>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Booking Restriction Notice */}
//                 {!compliance.isComplete && (
//                   <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                     <div className="flex items-center gap-2 text-yellow-800">
//                       <AlertTriangle className="h-4 w-4" />
//                       <span className="font-medium">Booking Restricted</span>
//                     </div>
//                     <p className="text-sm text-yellow-700 mt-1">
//                       Complete all compliance requirements to start booking shifts. Missing: {compliance.missingItems.join(', ')}
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
          
//           {/* Availability Tab */}
//           <TabsContent value="availability" className="mt-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Set Your Weekly Availability</CardTitle>
//                 <CardDescription>
//                   Mark the days you're available to work. This helps agencies find shifts that match your schedule.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6">
//                   {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
//                     <div key={day} className="text-center">
//                       <label className="flex items-center justify-center space-x-2">
//                         <input
//                           type="checkbox"
//                           checked={availability[day] || false}
//                           onChange={(e) => {
//                             const newAvailability = { ...availability, [day]: e.target.checked };
//                             setAvailability(newAvailability);
//                           }}
//                           className="w-4 h-4 text-blue-600 rounded"
//                         />
//                         <span>{day.substring(0, 3)}</span>
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//                 <Button 
//                   onClick={() => handleAvailabilityUpdate(availability)}
//                   className="w-full md:w-auto"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? 'Saving...' : 'Save Availability'}
//                 </Button>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default DSPDashboard;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState, useCallback } from 'react';
import { getAvailableShifts, getDSPBookings, updateDSPAvailability, bookShift, cancelBooking } from '@/service/data';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, MapPin, DollarSign, User, CheckCircle, XCircle } from 'lucide-react';

const DSPDashboard = () => {
  const { toast } = useToast();
  const [availableShifts, setAvailableShifts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('shifts');

  // Get authentication data
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Memoized functions to prevent infinite re-renders
  const fetchShifts = useCallback(async () => {
    if (!token) return;
    
    try {
      console.log('🔄 Fetching available shifts...');
      const shifts = await getAvailableShifts(token);
      setAvailableShifts(shifts);
    } catch (error) {
      console.error('❌ Error fetching shifts:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to load shifts", 
        variant: "destructive" 
      });
    }
  }, [token, toast]);

  const fetchBookings = useCallback(async () => {
    if (!token) return;
    
    try {
      console.log('🔄 Fetching bookings...');
      const bookingsData = await getDSPBookings(token);
      setBookings(bookingsData);
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to load bookings", 
        variant: "destructive" 
      });
    }
  }, [token, toast]);

  const fetchInitialData = useCallback(async () => {
    if (!token || !user) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('🚀 Starting initial data fetch...');
      setIsLoading(true);
      
      // Use Promise.all for parallel requests but with error handling
      await Promise.all([
        fetchShifts().catch(err => console.error('Shift fetch error:', err)),
        fetchBookings().catch(err => console.error('Booking fetch error:', err))
      ]);
      
      console.log('✅ Initial data fetch completed');
    } catch (error) {
      console.error('❌ Error in initial data fetch:', error);
      toast({ 
        title: "Error", 
        description: "Failed to load dashboard data", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, user, fetchShifts, fetchBookings, toast]);

  // Fixed useEffect - runs only once on component mount
  useEffect(() => {
    console.log('🏠 DSPDashboard mounted - fetching initial data');
    
    const loadData = async () => {
      if (token && user) {
        await fetchInitialData();
      } else {
        console.log('❌ No token or user found');
        setIsLoading(false);
        toast({ 
          title: "Authentication Error", 
          description: "Please log in again", 
          variant: "destructive" 
        });
      }
    };

    loadData();

    // Cleanup function
    return () => {
      console.log('🧹 DSPDashboard cleanup');
    };
  }, []); // Empty dependency array - runs only once

  // SIMPLIFIED: Remove compliance check
  const handleBookShift = async (shiftId) => {
    if (!token) {
      toast({ 
        title: "Error", 
        description: "Please log in again", 
        variant: "destructive" 
      });
      return;
    }

    try {
      console.log('📅 Booking shift:', shiftId);
      await bookShift(token, shiftId);
      toast({ title: "Success", description: "Shift booked successfully!" });
      
      // Refresh data
      await fetchShifts();
      setActiveTab('bookings');
    } catch (error) {
      console.error('❌ Error booking shift:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!token) {
      toast({ 
        title: "Error", 
        description: "Please log in again", 
        variant: "destructive" 
      });
      return;
    }

    try {
      console.log('❌ Cancelling booking:', bookingId);
      await cancelBooking(token, bookingId);
      toast({ title: "Success", description: "Booking cancelled successfully" });
      
      await fetchBookings();
    } catch (error) {
      console.error('❌ Error cancelling booking:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleAvailabilityUpdate = async (newAvailability) => {
    if (!token) {
      toast({ 
        title: "Error", 
        description: "Please log in again", 
        variant: "destructive" 
      });
      return;
    }

    try {
      console.log('📊 Updating availability:', newAvailability);
      await updateDSPAvailability(token, newAvailability);
      setAvailability(newAvailability);
      toast({ title: "Success", description: "Availability updated successfully" });
    } catch (error) {
      console.error('❌ Error updating availability:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { variant: 'secondary', label: 'Pending' },
      'confirmed': { variant: 'default', label: 'Confirmed' },
      'completed': { variant: 'outline', label: 'Completed' },
      'cancelled': { variant: 'destructive', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Manual refresh function
  const handleManualRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    if (token && user) {
      setIsLoading(true);
      try {
        await fetchInitialData();
        toast({ title: "Refreshed", description: "Data updated successfully" });
      } catch (error) {
        toast({ title: "Refresh Error", description: "Failed to refresh data", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-600">Session Expired</h2>
          <p>Please log in again to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Refresh Button */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">DSP Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.first_name} {user.last_name}!</p>
              <p className="text-sm text-gray-500">Manage your shifts and availability</p>
            </div>
            <div className="text-right">
              <Button 
                variant="outline" 
                onClick={handleManualRefresh}
                className="mb-2"
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <p className="text-sm text-gray-600">Member since {new Date(user.createdAt).getFullYear()}</p>
              <Badge variant="outline" className="mt-1">{user.role.toUpperCase()}</Badge>
            </div>
          </div>
        </div>

        {/* Stats Overview - REMOVED compliance stat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{availableShifts.length}</p>
                  <p className="text-sm text-gray-600">Available Shifts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'confirmed').length}</p>
                  <p className="text-sm text-gray-600">Confirmed Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{bookings.filter(b => b.status === 'pending').length}</p>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs - REMOVED compliance tab */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shifts">Available Shifts</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>
          
          {/* Available Shifts Tab - SIMPLIFIED book button */}
          <TabsContent value="shifts" className="mt-6">
            <div className="grid gap-6">
              {availableShifts.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">No available shifts at the moment.</p>
                    <p className="text-sm text-gray-400">Check back later for new opportunities.</p>
                  </CardContent>
                </Card>
              ) : (
                availableShifts.map((shift) => (
                  <Card key={shift._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {shift.title}
                            <Badge variant="outline">{shift.type || 'General'}</Badge>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-2">
                            <MapPin className="h-4 w-4" />
                            {shift.location}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">${shift.rate}<span className="text-sm font-normal">/hour</span></p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{new Date(shift.startTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>
                            {new Date(shift.startTime).toLocaleTimeString()} - {new Date(shift.endTime).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span>Posted by: {shift.agency?.firstname} {shift.agency?.lastname}</span>
                        </div>
                        <Button 
                          onClick={() => handleBookShift(shift._id)}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Booking...' : 'Book Shift'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* My Bookings Tab (unchanged) */}
          <TabsContent value="bookings" className="mt-6">
            <div className="grid gap-6">
              {bookings.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">You haven't booked any shifts yet.</p>
                    <p className="text-sm text-gray-400">Browse available shifts to get started.</p>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{booking.shift?.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-2">
                            <MapPin className="h-4 w-4" />
                            {booking.shift?.location}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(booking.status)}
                          <p className="text-lg font-semibold text-green-600 mt-1">
                            ${booking.shift?.rate}/hour
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Date & Time</p>
                          <p className="font-medium">
                            {new Date(booking.shift?.startTime).toLocaleString()} - {' '}
                            {new Date(booking.shift?.endTime).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Agency</p>
                          <p className="font-medium">
                            {booking.agency?.firstname} {booking.agency?.lastname}
                          </p>
                        </div>
                      </div>
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={isLoading}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {isLoading ? 'Cancelling...' : 'Cancel Request'}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Availability Tab (unchanged) */}
          <TabsContent value="availability" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Set Your Weekly Availability</CardTitle>
                <CardDescription>
                  Mark the days you're available to work. This helps agencies find shifts that match your schedule.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="text-center">
                      <label className="flex items-center justify-center space-x-2">
                        <input
                          type="checkbox"
                          checked={availability[day] || false}
                          onChange={(e) => {
                            const newAvailability = { ...availability, [day]: e.target.checked };
                            setAvailability(newAvailability);
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span>{day.substring(0, 3)}</span>
                      </label>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => handleAvailabilityUpdate(availability)}
                  className="w-full md:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Availability'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DSPDashboard;