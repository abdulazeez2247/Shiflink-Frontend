// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Plus, BookOpen, TrendingUp, Users, BarChart3, FileText, Target } from 'lucide-react';
// import { Navigate } from 'react-router-dom';
// import TrainerProfile from '@/components/TrainerProfile';
// import DatabaseCourseManager from '@/components/DatabaseCourseManager';
// import CourseCreationWizard from '@/components/CourseCreationWizard';
// import CourseContentManager from '@/components/CourseContentManager';
// import { createCourse, getTrainerCourses, getTrainerStats } from '@/service/data';

// const TrainerDashboard = () => {
//   const [showCourseWizard, setShowCourseWizard] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [refreshCourses, setRefreshCourses] = useState(0);
//   const [activeTab, setActiveTab] = useState('courses');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [user, setUser] = useState(null);
//   const [stats, setStats] = useState({
//     totalCourses: 0,
//     totalParticipants: 0,
//     totalRevenue: 0,
//     upcomingCourses: 0
//   });

//   const getToken = () => localStorage.getItem('token');
//   const getUserId = () => {
//     const userData = localStorage.getItem('user');
//     return userData ? JSON.parse(userData)._id : null;
//   };

//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       window.location.href = '/login';
//       return;
//     }

//     const userData = localStorage.getItem('user');
//     if (userData) {
//       setUser(JSON.parse(userData));
//     }
    
//     fetchTrainerData();
//   }, []);

// // Updated TrainerDashboard.tsx - Fix the fetchTrainerData function
// const fetchTrainerData = async () => {
//   try {
//     setIsLoading(true);
//     setError('');
//     const token = getToken();
    
//     if (!token) {
//       setError('Authentication required. Please login again.');
//       window.location.href = '/login';
//       return;
//     }

//     // Try to fetch stats, but handle if endpoint doesn't exist
//     let statsData;
//     try {
//       statsData = await getTrainerStats(token);
//     } catch (statsError) {
//       console.log('Stats endpoint not available, calculating from courses');
//       // If stats endpoint fails, we'll calculate from courses
//       statsData = null;
//     }

//     // Always fetch courses
//     const coursesData = await getTrainerCourses(token);
    
//     // Ensure coursesData is an array
//     const coursesArray = Array.isArray(coursesData) ? coursesData : [];
    
//     // If stats failed, calculate from courses
//     if (!statsData) {
//       setStats({
//         totalCourses: coursesArray.length,
//         totalParticipants: coursesArray.reduce((sum, course) => sum + (course.participants?.length || 0), 0),
//         totalRevenue: coursesArray.reduce((sum, course) => sum + (course.price || 0), 0),
//         upcomingCourses: coursesArray.filter(course => 
//           course.startDate && new Date(course.startDate) > new Date()
//         ).length
//       });
//     } else {
//       setStats(statsData);
//     }
    
//   } catch (error) {
//     console.error('Error fetching trainer data:', error);
//     setError('Failed to fetch trainer data');
    
//     // Set default stats on error
//     setStats({
//       totalCourses: 0,
//       totalParticipants: 0,
//       totalRevenue: 0,
//       upcomingCourses: 0
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const handleCourseCreated = async (courseData) => {
//     try {
//       const token = getToken();
//       if (!token) {
//         setError('Authentication required. Please login again.');
//         window.location.href = '/login';
//         return;
//       }

//       await createCourse(token, courseData);
//       setShowCourseWizard(false);
//       setRefreshCourses(prev => prev + 1);
//       fetchTrainerData(); // Refresh data after creating course
//     } catch (error) {
//       setError(error.message || 'Failed to create course');
//     }
//   };

//   const handleManageCourse = (course) => {
//     setSelectedCourse(course);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
//           <p>Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/auth" replace />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         {error && (
//           <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//             {error}
//           </div>
//         )}

//         <div className="mb-8">
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Trainer Dashboard</h1>
//               <p className="text-gray-600">Manage your courses and track participants</p>
//             </div>
            
//             <div className="flex space-x-3">
//               <Button 
//                 onClick={() => setShowCourseWizard(true)}
//                 className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>Create Course</span>
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Trainer Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Courses</p>
//                   <p className="text-2xl font-bold text-blue-600">{stats.totalCourses}</p>
//                 </div>
//                 <BookOpen className="w-8 h-8 text-blue-500" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Participants</p>
//                   <p className="text-2xl font-bold text-green-600">{stats.totalParticipants}</p>
//                 </div>
//                 <Users className="w-8 h-8 text-green-500" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//                   <p className="text-2xl font-bold text-purple-600">${stats.totalRevenue}</p>
//                 </div>
//                 <TrendingUp className="w-8 h-8 text-purple-500" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Upcoming Courses</p>
//                   <p className="text-2xl font-bold text-orange-600">{stats.upcomingCourses}</p>
//                 </div>
//                 <Target className="w-8 h-8 text-orange-500" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {selectedCourse && (
//           <Card className="mb-8">
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle className="flex items-center space-x-2">
//                   <BookOpen className="w-5 h-5" />
//                   <span>Course Content Manager</span>
//                 </CardTitle>
//                 <Button 
//                   variant="outline" 
//                   onClick={() => setSelectedCourse(null)}
//                 >
//                   Close
//                 </Button>
//               </div>
//               <CardDescription>
//                 Managing content for: <strong>{selectedCourse.title}</strong>
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <CourseContentManager course={selectedCourse} />
//             </CardContent>
//           </Card>
//         )}

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="courses">Courses</TabsTrigger>
//             <TabsTrigger value="profile">Profile</TabsTrigger>
//           </TabsList>
          
// <TabsContent value="courses" className="mt-6">
//   <DatabaseCourseManager 
//     key={refreshCourses}
//     onManageCourse={handleManageCourse}
//   />
// </TabsContent> 
          
//           <TabsContent value="profile" className="mt-6">
//             <TrainerProfile />
//           </TabsContent>
//         </Tabs>

//         <Dialog open={showCourseWizard} onOpenChange={setShowCourseWizard}>
//           <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Create New Course</DialogTitle>
//             </DialogHeader>
//             <CourseCreationWizard
//               onCourseCreated={handleCourseCreated}
//               onCancel={() => setShowCourseWizard(false)}
//             />
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default TrainerDashboard;
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, BookOpen, TrendingUp, Users, BarChart3, FileText, Target } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getTrainerCourses, getTrainerStats, createCourse } from '@/service/data';
import DatabaseCourseManager from '@/components/DatabaseCourseManager';
import CourseCreationWizard from '@/components/CourseCreationWizard';
import TrainerProfile from '@/components/TrainerProfile';

const TrainerDashboard = () => {
  const [showCourseWizard, setShowCourseWizard] = useState(false);
  const [refreshCourses, setRefreshCourses] = useState(0);
  const [activeTab, setActiveTab] = useState('courses');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalParticipants: 0,
    totalRevenue: 0,
    upcomingCourses: 0
  });

  const { toast } = useToast();

  const getToken = () => localStorage.getItem('token');
  const getUserId = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData)._id : null;
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchTrainerData();
  }, []);

  const fetchTrainerData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = getToken();
      
      if (!token) {
        setError('Authentication required. Please login again.');
        window.location.href = '/login';
        return;
      }

      // Fetch stats and courses
      const [statsData, coursesData] = await Promise.all([
        getTrainerStats(token),
        getTrainerCourses(token)
      ]);
      
      setStats(statsData);
      
    } catch (error) {
      console.error('Error fetching trainer data:', error);
      setError('Failed to fetch trainer data');
      
      // Set default stats on error
      setStats({
        totalCourses: 0,
        totalParticipants: 0,
        totalRevenue: 0,
        upcomingCourses: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseCreated = async (courseData) => {
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please login again.');
        window.location.href = '/login';
        return;
      }

      await createCourse(token, courseData);
      setShowCourseWizard(false);
      setRefreshCourses(prev => prev + 1);
      fetchTrainerData(); // Refresh data after creating course
      
      toast({
        title: "Success",
        description: "Course created successfully!"
      });
    } catch (error) {
      console.error('Error creating course:', error);
      setError(error.message || 'Failed to create course');
      
      toast({
        title: "Error",
        description: error.message || "Failed to create course",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Trainer Dashboard</h1>
              <p className="text-gray-600">Manage your courses and track participants</p>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowCourseWizard(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Course</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Trainer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalCourses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalParticipants}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-600">${stats.totalRevenue}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Courses</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.upcomingCourses}</p>
                </div>
                <Target className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="mt-6">
            <DatabaseCourseManager 
              key={refreshCourses}
            />
          </TabsContent> 
          
          <TabsContent value="profile" className="mt-6">
            <TrainerProfile />
          </TabsContent>
        </Tabs>

        <Dialog open={showCourseWizard} onOpenChange={setShowCourseWizard}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <CourseCreationWizard
              onCourseCreated={handleCourseCreated}
              onCancel={() => setShowCourseWizard(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TrainerDashboard;